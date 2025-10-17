const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const uploadBtn = document.getElementById('uploadBtn');
const message = document.getElementById('message');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');

let selectedFile = null;

// 点击上传区域
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// 文件选择
fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

// 拖拽上传
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
});

function handleFile(file) {
    if (file) {
        selectedFile = file;
        fileName.textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        fileInfo.classList.add('show');
        message.style.display = 'none';
    }
}

// 上传文件
uploadBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    uploadBtn.disabled = true;
    uploadBtn.textContent = '上传中...';
    progressBar.classList.add('show');
    progressFill.style.width = '50%';

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        progressFill.style.width = '100%';

        if (result.success) {
            showMessage('✅ ' + result.message, 'success');
            fileInfo.classList.remove('show');
            selectedFile = null;
            fileInput.value = '';
            progressBar.classList.remove('show');
            progressFill.style.width = '0%';
        } else {
            showMessage('❌ ' + result.message, 'error');
        }
    } catch (error) {
        showMessage('❌ 上传失败: ' + error.message, 'error');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = '开始上传';
        setTimeout(() => {
            progressBar.classList.remove('show');
            progressFill.style.width = '0%';
        }, 1000);
    }
});

function showMessage(text, type) {
    message.textContent = text;
    message.className = 'message ' + type;
    setTimeout(() => {
        message.style.display = 'none';
    }, 5000);
}