document.addEventListener('DOMContentLoaded', function () {
    const removeButton = document.getElementById('remove-button');
    const attributeConfig = document.getElementById('attribute-config');
    const clearButton = document.getElementById('clear-button');

    removeButton.textContent = chrome.i18n.getMessage('removeButtonText');
    clearButton.textContent = chrome.i18n.getMessage('clearButtonText');


    // 页面加载时，从存储中读取之前保存的值并填充到 textarea 中
    chrome.storage.local.get(['attributeConfig'], function (result) {
        if (result.attributeConfig) {
            attributeConfig.value = result.attributeConfig;
        }
    });

    removeButton.addEventListener('click', function () {
        const config = attributeConfig.value;

        // 保存配置到本地存储
        chrome.storage.local.set({'attributeConfig': config}, function () {
            console.log('Attribute configuration saved:', config);
        });

        // 查询当前激活的标签页
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const activeTab = tabs[0];
            if (activeTab) {
                // 向当前激活的标签页发送消息
                chrome.tabs.sendMessage(activeTab.id, {
                    action: 'removeElements',
                    config: config
                }, function (response) {
                    if (chrome.runtime.lastError) {
                        console.error('Error sending message:', chrome.runtime.lastError);
                    } else {
                        console.log('Message sent successfully:', response);
                    }
                });
            }
        });
    });

    clearButton.addEventListener('click', function () {
        // 清除 textarea 中的内容
        attributeConfig.value = '';

        // 清除本地存储中的配置数据
        chrome.storage.local.remove('attributeConfig', function () {
            console.log('Attribute configuration cleared.');
            // 查询当前激活的标签页
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                const activeTab = tabs[0];
                if (activeTab) {
                    // 重新加载当前激活的标签页
                    chrome.tabs.reload(activeTab.id);
                }
            });
        });
    });

});