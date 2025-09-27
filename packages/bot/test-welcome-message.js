const { WelcomeMessageBuilder } = require('./dist/utils/WelcomeMessageBuilder.js');

console.log('Testing Welcome Message Builder...');

try {
    const builder = new WelcomeMessageBuilder('en', '123456789');
    const message = builder.build();
    
    console.log('Message structure:');
    console.log('Content:', message.content);
    console.log('Components count:', message.components?.length || 0);
    console.log('Files count:', message.files?.length || 0);
    
    if (message.content) {
        console.log('\nBanner URL found in content:', message.content.includes('ik.imagekit.io'));
    }
    
    console.log('\nTest completed successfully!');
} catch (error) {
    console.error('Error testing welcome message:', error);
}