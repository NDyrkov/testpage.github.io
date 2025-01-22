import http.server
import ssl

# Настройки сервера
HOST = 'localhost'  # Или '127.0.0.1' для работы только локально
PORT = 4443         # Порт для HTTPS

# Настраиваем обработчик запросов
handler = http.server.SimpleHTTPRequestHandler

# Создаем HTTP-сервер
httpd = http.server.HTTPServer((HOST, PORT), handler)

# Настраиваем SSL
httpd.socket = ssl.wrap_socket(
    httpd.socket,
    server_side=True,
    certfile="cert.pem",
    keyfile="key.pem",
    ssl_version=ssl.PROTOCOL_TLS,
)

print(f"HTTPS сервер запущен на https://{HOST}:{PORT}")
# Запуск сервера
httpd.serve_forever()
