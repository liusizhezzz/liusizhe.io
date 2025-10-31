// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log("欢迎访问我的个人主页！");
    
    // 平滑滚动功能
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });
    
    // 表单提交处理
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 获取表单数据
            const formData = new FormData(this);
            const jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });

            console.log('准备发送的数据:', jsonData);

            const form = this;
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = '发送中...';
            submitButton.disabled = true;

            // 发送数据到n8n webhook
            fetch('https://liusizhe.app.n8n.cloud/webhook-test/contact-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData)
            })
            .then(response => {
                console.log('服务器响应状态:', response.status);
                if (response.ok) {
                    return response.text().then(text => {
                        console.log('成功响应内容:', text);
                        return { success: true, text: text };
                    });
                } else {
                    return response.text().then(text => {
                        console.log('错误响应内容:', text);
                        return { success: false, status: response.status, text: text };
                    });
                }
            })
            .then(result => {
                if (result.success) {
                    alert('感谢您的消息！我会尽快回复您。');
                    form.reset();
                } else {
                    alert(`发送失败，服务器返回状态: ${result.status}\n${result.text}`);
                }
            })
            .catch(error => {
                console.error('网络错误详情:', error);
                alert(`发送失败: ${error.message}\n请检查网络连接或稍后再试。`);
            })
            .finally(() => {
                // 恢复按钮状态
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
    
    // 技能进度条动画
    const skillBars = document.querySelectorAll('.skill-progress');
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = progress;
                }, 300);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
});
