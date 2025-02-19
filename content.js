chrome.storage.local.get(['attributeConfig'], function (result) {
    try {
        const config_values = result.attributeConfig;
        if (config_values) {
            const config = config_values.split(',');
            config.forEach((item) => {
                const elements = document.querySelectorAll(`[${item}]`);
                elements.forEach(element => {
                    element.parentNode.removeChild(element);
                });
            })
        }

    } catch (e) {
        console.log(e)
    }

});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'removeElements') {
        try {
            const config_values = message.config;
            if (config_values) {
                const config = config_values.split(',');
                config.forEach((item) => {
                    const elements = document.querySelectorAll(`[${item}]`);
                    elements.forEach(element => {
                        element.parentNode.removeChild(element);
                    });
                })
            }
        } catch (e) {

        }
        sendResponse({status: 'Elements removed successfully'});
    }
    return true;
});