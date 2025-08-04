@echo off
echo ========================================
echo    MIGRACION DE ACCESORIOS
echo ========================================
echo.

echo 1. Haciendo backup de la base de datos...
echo    (Asegurate de tener pg_dump instalado)
echo.

echo 2. Ejecutando la aplicacion con migracion automatica...
echo    Flyway ejecutara la migracion al iniciar
echo.

echo 3. Iniciando Spring Boot...
echo    Presiona Ctrl+C para detener
echo.

gradlew bootRun

echo.
echo ========================================
echo    MIGRACION COMPLETADA
echo ========================================
echo.
echo Para verificar la migracion:
echo curl -X GET http://localhost:8080/api/accesorios
echo.
pause 