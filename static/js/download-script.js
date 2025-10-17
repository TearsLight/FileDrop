document.addEventListener('DOMContentLoaded', function() {
    const filesList = document.getElementById('filesList');
    const fileCount = document.getElementById('fileCount');
    const refreshBtn = document.getElementById('refreshBtn');

    async function loadFiles() {
        try {
            filesList.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <div>加载中...</div>
                </div>
            `;

            const response = await fetch('/api/files');
            const result = await response.json();

            if (result.success) {
                const sortedFiles = result.files.sort((a, b) => {
                    return new Date(b.create_time) - new Date(a.create_time);
                });

                fileCount.textContent = `文件数量: ${sortedFiles.length}`;

                if (sortedFiles.length === 0) {
                    filesList.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-icon">📂</div>
                            <div>暂无文件</div>
                            <div style="margin-top: 10px; font-size: 13px;">请先上传文件</div>
                        </div>
                    `;
                    return;
                }

                const table = document.createElement('table');
                table.className = 'files-table';
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>文件名</th>
                            <th>上传时间(UTC)</th>
                            <th>文件大小(MB)</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedFiles.map(file => `
                            <tr>
                                <td>${file.name}</td>
                                <td>${file.create_time}</td>
                                <td>${file.size_mb}</td>
                                <td>
                                    <button class="download-btn" 
                                            onclick="downloadFile('${encodeURIComponent(file.name)}')">
                                        ⬇️ 下载
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                `;

                filesList.innerHTML = '';
                filesList.appendChild(table);
                table.style.display = 'table';

            } else {
                filesList.innerHTML = `<div class="error">加载失败: ${result.message}</div>`;
            }
        } catch (error) {
            filesList.innerHTML = `
                <div class="error">
                    <div>加载失败</div>
                    <div style="margin-top: 10px; font-size: 13px;">${error.message}</div>
                </div>
            `;
        }
    }

    window.downloadFile = function(filename) {
        window.location.href = `/api/download/${filename}`;
    };

    refreshBtn.addEventListener('click', loadFiles);

    loadFiles();
});