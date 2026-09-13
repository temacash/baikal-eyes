#!/usr/bin/env bash
# Собирает одностраничный прототип из частей в src/ в файл baikal-eyes.html
# Использование:  ./build.sh
set -e
cd "$(dirname "$0")"
cat src/p1.html src/p2.html src/p3.html src/p4.html src/p5.html src/p6.html > baikal-eyes.html
echo "Готово: $(pwd)/baikal-eyes.html ($(wc -c < baikal-eyes.html) байт)"
