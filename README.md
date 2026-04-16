# 🚀 RocketNode | Premium Pterodactyl Theme

Welcome to the **RocketNode** premium theme for [Pterodactyl](https://pterodactyl.io). This theme is designed for high-performance game hosting providers who want a modern, futuristic, and professional interface.

![GitHub last commit](https://img.shields.io/github/last-commit/pedro-enh/therme2?style=flat-square&color=3b82f6)
![GitHub stars](https://img.shields.io/github/stars/pedro-enh/therme2?style=flat-square&color=3b82f6)
![PHP Version](https://img.shields.io/badge/PHP-8.2%2B-blue?style=flat-square)

---

## ✨ Features

- **Modern Dashboard**: A complete vertical layout overhaul with quick action bubbles and personalized greetings.
- **Horizontal Navigation**: Say goodbye to the sidebar! All server controls are now in a sleek top navigation bar.
- **Futuristic UI**: Built with a deep navy palette, modern typography (*Space Grotesk* & *Inter*), and subtle glowing accents.
- **Smart Server Banner**: Instant access to IP, Node, and Egg information with integrated power controls.
- **Optimized Console**: Side-by-side terminal and real-time resource graphs for better monitoring.
- **Premium File Manager**: Redesigned rows with improved spacing and type-specific icon coloring.

---

## 📸 Preview

*Screenshots coming soon!*

---

## 🛠️ Installation

### 1. Download the theme
Change into your Pterodactyl directory and download the theme files from the **therme2** repository:

```bash
cd /var/www/pterodactyl

# Download and extract the theme
curl -L https://github.com/pedro-enh/therme2/archive/refs/heads/main.tar.gz | tar -xzv --strip-components=1

# Set initial permissions
chmod -R 755 storage/* bootstrap/cache
```

### 2. Install Dependencies & Build
Because this theme features a custom React frontend, you must rebuild the UI:

```bash
# Using Yarn (Recommended)
yarn install
yarn build:production

# OR Using NPM
npm install
npm run build:production
```

### 3. Finalize Update
Clear the cache and ensure the database is updated:

```bash
php artisan view:clear
php artisan config:clear
php artisan migrate --seed --force
php artisan queue:restart
```

### 4. Set Permissions
Ensure your webserver owns the files:

```bash
# For NGINX/Apache (Ubuntu/Debian)
chown -R www-data:www-data /var/www/pterodactyl/*
```

---

## 🌟 Star History

<a href="https://star-history.com/#pedro-enh/therme2&Timeline">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=pedro-enh/therme2&type=Timeline&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=pedro-enh/therme2&type=Timeline" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=pedro-enh/therme2&type=Timeline" />
  </picture>
</a>

---

## 📄 License

Pterodactyl® Copyright © 2015 - 2024 Dane Everitt and contributors.  
Theme modifications by **Pedro**. Released under the [MIT License](./LICENSE.md).
.
