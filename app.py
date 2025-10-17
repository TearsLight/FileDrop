#app.py
from flask import Flask, render_template, request, send_file, jsonify, redirect, url_for
import os
from flask import make_response

import os
from datetime import datetime


app = Flask(__name__)

# 配置上传文件夹
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024 * 1024  # 最大1GB

# 允许的文件类型
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'zip', 'icon', 'mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'mp3', 'wav', 'flac'}

def allowed_file(filename):
    """检查文件后缀是否在允许列表中"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return redirect(url_for('upload_page'))

@app.route('/upload')
def upload_page():
    return render_template('upload.html')

@app.route('/download')
def download_page():
    return render_template('download.html')

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': '没有文件被上传'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'success': False, 'message': '没有选择文件'}), 400
    
    if file and allowed_file(file.filename):

        original_filename = file.filename
        
        if '.' in original_filename:
            name_part, ext_part = original_filename.rsplit('.', 1)
            base_name = f"{name_part}.{ext_part}"
        else:
            name_part = original_filename
            ext_part = ''
            base_name = original_filename
        
        upload_folder = app.config['UPLOAD_FOLDER']
        new_filename = base_name
        counter = 1
        while os.path.exists(os.path.join(upload_folder, new_filename)):
            if ext_part:
                new_filename = f"{name_part}({counter}).{ext_part}"
            else:
                new_filename = f"{name_part}({counter})"
            counter += 1
        
        filepath = os.path.join(upload_folder, new_filename)
        file.save(filepath)
        
        return jsonify({
            'success': True, 
            'message': '文件上传成功', 
            'filename': new_filename
        }), 200
    
    return jsonify({'success': False, 'message': '不支持的文件类型'}), 400

@app.route('/api/files', methods=['GET'])
def list_files():
    files = []
    upload_folder = app.config['UPLOAD_FOLDER']
    for filename in os.listdir(upload_folder):
        filepath = os.path.join(upload_folder, filename)
        if os.path.isfile(filepath):
            size = os.path.getsize(filepath)
            stat = os.stat(filepath)
            if os.name == 'nt':
                create_time = datetime.fromtimestamp(stat.st_ctime)
            else:
                try:
                    create_time = datetime.fromtimestamp(stat.st_birthtime)
                except AttributeError:
                    create_time = datetime.fromtimestamp(stat.st_mtime)
            
            files.append({
                'name': filename,
                'size': size,
                'size_mb': round(size / (1024 * 1024), 2),
                'create_time': create_time.strftime('%Y-%m-%d %H:%M:%S')
            })
    return jsonify({'success': True, 'files': files})

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(filepath) and os.path.isfile(filepath):
            return send_file(filepath, as_attachment=True, download_name=filename)
        else:
            return jsonify({'success': False, 'message': '文件不存在'}), 404
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=8080)