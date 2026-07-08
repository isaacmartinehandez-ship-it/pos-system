@echo off
chcp 65001 >nul
title POS System - SimplyGest Clone

echo ========================================
echo   POS System - Iniciando...
echo ========================================
echo.

:: Cambiar al directorio del proyecto
cd /d "%~dp0"

:: Ruta a Node.js (instalado con fnm)
set NODE_DIR=C:\Users\isaac\AppData\Roaming\fnm\node-versions\v20.20.2\installation

:: Agregar Node.js al PATH para que npm lo encuentre
set PATH=%NODE_DIR%;%PATH%

:: Instalar dependencias si faltan
echo [1/2] Verificando e instalando dependencias...
call npm install --legacy-peer-deps

echo.
echo [2/2] Iniciando servidor de desarrollo...
echo.

:: Iniciar el servidor
call npm run dev

:: Mantener la ventana abierta si se cierra el servidor
echo.
echo El servidor se ha cerrado. Presiona cualquier tecla para salir...
pause >nul
