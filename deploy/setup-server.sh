#!/usr/bin/env bash
# Однократный скрипт первичной настройки VPS для shabbly.ru
# Запускать на сервере под root (или sudo):
#   sudo bash setup-server.sh
#
# Предполагается, что Nginx и Certbot уже установлены, SSL получен.

set -euo pipefail

DOMAIN="shabbly.ru"
SITE_DIR="/var/www/shabbly"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
NGINX_CONF_SRC="$(dirname "$(readlink -f "$0")")/nginx-shabbly.conf"
NGINX_CONF_DST="/etc/nginx/sites-available/shabbly.conf"
NGINX_LINK="/etc/nginx/sites-enabled/shabbly.conf"

echo "==> 1) Создаём deploy-пользователя ($DEPLOY_USER), если его нет"
if ! id -u "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
fi

echo "==> 2) Создаём папку сайта $SITE_DIR"
mkdir -p "$SITE_DIR"
chown -R "$DEPLOY_USER":www-data "$SITE_DIR"
chmod -R 755 "$SITE_DIR"

echo "==> 3) Готовим папку для Let's Encrypt webroot"
mkdir -p /var/www/certbot
chown -R www-data:www-data /var/www/certbot

echo "==> 4) Готовим ~/.ssh для $DEPLOY_USER"
SSH_DIR="/home/$DEPLOY_USER/.ssh"
mkdir -p "$SSH_DIR"
touch "$SSH_DIR/authorized_keys"
chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$SSH_DIR"
chmod 700 "$SSH_DIR"
chmod 600 "$SSH_DIR/authorized_keys"

echo "==> 5) Копируем Nginx конфиг"
if [ ! -f "$NGINX_CONF_SRC" ]; then
  echo "ERROR: не найден $NGINX_CONF_SRC"
  exit 1
fi
cp "$NGINX_CONF_SRC" "$NGINX_CONF_DST"

echo "==> 6) Включаем сайт"
ln -sf "$NGINX_CONF_DST" "$NGINX_LINK"

# Удаляем default, если включен
if [ -L /etc/nginx/sites-enabled/default ]; then
  rm /etc/nginx/sites-enabled/default
fi

echo "==> 7) Проверяем конфиг Nginx и перезагружаем"
nginx -t
systemctl reload nginx

echo "==> 8) Разрешаем sudo на reload nginx без пароля (опционально, для деплоя)"
SUDOERS_FILE="/etc/sudoers.d/$DEPLOY_USER-nginx"
echo "$DEPLOY_USER ALL=(root) NOPASSWD: /bin/systemctl reload nginx" > "$SUDOERS_FILE"
chmod 440 "$SUDOERS_FILE"

echo ""
echo "✅ Готово!"
echo ""
echo "Дальше:"
echo "  1) Положите публичный SSH-ключ деплоя в:"
echo "     $SSH_DIR/authorized_keys"
echo "  2) Убедитесь, что DNS A-запись shabbly.ru указывает на этот сервер."
echo "  3) Если SSL ещё не получен:"
echo "     certbot --nginx -d shabbly.ru -d www.shabbly.ru"
echo "  4) Сделайте push в main — GitHub Actions задеплоит dist/ в $SITE_DIR"
