import { EventEmitter } from 'events';

/**
 * Task interface for the queue
 */
export interface Task<T = any> {
    id: string;
    execute: () => Promise<T>;
    priority: 'low' | 'medium' | 'high';
    retries: number;
    maxRetries: number;
    delay: number;
    createdAt: Date;
}

/**
 * Task queue options
 */
export interface TaskQueueOptions {
    concurrency?: number;
    defaultMaxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
}

/**
 * Async task queue with exponential backoff and priority handling
 */
export class TaskQueue extends EventEmitter {
    private queue: Task[] = [];
    private running: Map<string, Promise<any>> = new Map();
    private concurrency: number;
    private defaultMaxRetries: number;
    private baseDelay: number;
    private maxDelay: number;
    private backoffMultiplier: number;
    private processing = false;

    constructor(options: TaskQueueOptions = {}) {
        super();
        this.concurrency = options.concurrency || 5;
        this.defaultMaxRetries = options.defaultMaxRetries || 3;
        this.baseDelay = options.baseDelay || 1000; // 1 second
        this.maxDelay = options.maxDelay || 30000; // 30 seconds
        this.backoffMultiplier = options.backoffMultiplier || 2;
    }

    /**
     * Add a task to the queue
     */
    async addTask<T>(
        id: string,
        execute: () => Promise<T>,
        options: {
            priority?: 'low' | 'medium' | 'high';
            maxRetries?: number;
        } = {}
    ): Promise<T> {
        const task: Task<T> = {
            id,
            execute,
            priority: options.priority || 'medium',
            retries: 0,
            maxRetries: options.maxRetries || this.defaultMaxRetries,
            delay: this.baseDelay,
            createdAt: new Date(),
        };

        // Check if task with same ID is already running
        if (this.running.has(id)) {
            console.log(`Task ${id} is already running, waiting for completion`);
            return this.running.get(id) as Promise<T>;
        }

        // Check if task with same ID is already in queue
        const existingTaskIndex = this.queue.findIndex(t => t.id === id);
        if (existingTaskIndex !== -1) {
            console.log(`Task ${id} is already queued, replacing with new task`);
            this.queue.splice(existingTaskIndex, 1);
        }

        return new Promise((resolve, reject) => {
            const wrappedTask = {
                ...task,
                execute: async () => {
                    try {
                        const result = await execute();
                        resolve(result);
                        return result;
                    } catch (error) {
                        reject(error);
                        throw error;
                    }
                }
            };

            this.queue.push(wrappedTask);
            this.sortQueue();
            this.processQueue();
        });
    }

    /**
     * Sort queue by priority and creation time
     */
    private sortQueue(): void {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        
        this.queue.sort((a, b) => {
            // First sort by priority
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            if (priorityDiff !== 0) return priorityDiff;
            
            // Then by creation time (older first)
            return a.createdAt.getTime() - b.createdAt.getTime();
        });
    }

    /**
     * Process the queue
     */
    private async processQueue(): Promise<void> {
        if (this.processing || this.running.size >= this.concurrency) {
            return;
        }

        this.processing = true;

        while (this.queue.length > 0 && this.running.size < this.concurrency) {
            const task = this.queue.shift();
            if (!task) break;

            this.executeTask(task);
        }

        this.processing = false;
    }

    /**
     * Execute a single task with retry logic
     */
    private async executeTask(task: Task): Promise<void> {
        const promise = this.runTaskWithRetry(task);
        this.running.set(task.id, promise);

        try {
            await promise;
        } catch (error) {
            console.error(`Task ${task.id} failed after ${task.maxRetries} retries:`, error);
            this.emit('taskFailed', { task, error });
        } finally {
            this.running.delete(task.id);
            this.processQueue(); // Process next tasks
        }
    }

    /**
     * Run task with retry logic and exponential backoff
     */
    private async runTaskWithRetry(task: Task): Promise<any> {
        while (task.retries <= task.maxRetries) {
            try {
                console.log(`Executing task ${task.id} (attempt ${task.retries + 1}/${task.maxRetries + 1})`);
                const result = await task.execute();
                
                if (task.retries > 0) {
                    console.log(`Task ${task.id} succeeded after ${task.retries} retries`);
                }
                
                this.emit('taskCompleted', { task, result });
                return result;
            } catch (error) {
                task.retries++;
                
                if (task.retries > task.maxRetries) {
                    throw error;
                }

                // Calculate delay with exponential backoff
                const delay = Math.min(
                    task.delay * Math.pow(this.backoffMultiplier, task.retries - 1),
                    this.maxDelay
                );

                console.log(`Task ${task.id} failed (attempt ${task.retries}/${task.maxRetries + 1}), retrying in ${delay}ms`);
                this.emit('taskRetry', { task, error, delay });

                await this.sleep(delay);
            }
        }
    }

    /**
     * Sleep for specified milliseconds
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get queue statistics
     */
    getStats(): {
        queueLength: number;
        runningTasks: number;
        concurrency: number;
    } {
        return {
            queueLength: this.queue.length,
            runningTasks: this.running.size,
            concurrency: this.concurrency,
        };
    }

    /**
     * Clear the queue
     */
    clear(): void {
        this.queue = [];
    }

    /**
     * Get all running task IDs
     */
    getRunningTasks(): string[] {
        return Array.from(this.running.keys());
    }

    /**
     * Get all queued task IDs
     */
    getQueuedTasks(): string[] {
        return this.queue.map(task => task.id);
    }
}