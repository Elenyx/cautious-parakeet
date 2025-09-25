/**
 * Simple logger utility for the bot
 */
export class Logger {
    private static instance: Logger;

    private constructor() {}

    /**
     * Get singleton instance of Logger
     */
    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    /**
     * Log info message
     */
    public info(message: string, ...args: any[]): void {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    }

    /**
     * Log success message
     */
    public success(message: string, ...args: any[]): void {
        console.log(`[SUCCESS] ${new Date().toISOString()} - ${message}`, ...args);
    }

    /**
     * Log warning message
     */
    public warn(message: string, ...args: any[]): void {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
    }

    /**
     * Log error message
     */
    public error(message: string, ...args: any[]): void {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
    }

    /**
     * Log debug message
     */
    public debug(message: string, ...args: any[]): void {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
        }
    }
}

// Export a singleton instance for easy use
export const logger = Logger.getInstance();
