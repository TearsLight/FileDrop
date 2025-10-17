# FileDrop description
A lightweight, Flask-based file transfer tool designed for local network (LAN) use, enabling simple, secure file uploads and downloads with a clean, interactive web interface. 
It supports duplicate file handling (auto-adds serial numbers for duplicates), real-time file list display with upload timestamps, and smooth visual effects (semi-transparent container, hover animations) for an improved user experience. 
No complex reverse proxy configuration is required—just deploy the Flask service and access it directly via the LAN IP. 
Ideal for personal or small-team use to quickly share files between devices on the same network.

# FileDrop 项目描述
一款基于` Flask `开发的轻量级文件传输工具，专为局域网（LAN）场景设计，可实现简单、安全的文件上传与下载，搭配简洁且具交互性的网页界面。  
工具支持重复文件处理（自动为重复文件添加序号）、显示含上传时间戳的实时文件列表，并通过半透明容器、悬停动画等流畅视觉效果提升用户体验。无需复杂反向代理配置，部署 Flask 服务后，直接通过局域网 IP 即可访问。  
非常适合个人或小型团队使用，满足同一网络内多设备间的快速文件共享需求。

# Require && Run
This program Require Python >= 3.7
Run This command.
```
pip install flask
python app.py
```
It will listen at port 8080, use `http://{localhost}:8080` or `http://{your-server/LAN IP}:8080`
