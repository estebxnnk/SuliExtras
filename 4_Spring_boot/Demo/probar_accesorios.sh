#!/bin/bash

echo "========================================"
echo "    PRUEBA DE ACCESORIOS REFACTORIZADOS"
echo "========================================"
echo

echo "1. Iniciando la aplicacion..."
echo "   (Esto ejecutara la migracion y el seed data)"
echo

echo "2. Esperando a que la aplicacion inicie..."
sleep 10

echo "3. Probando endpoints de accesorios..."
echo

echo "- Obteniendo todos los accesorios:"
curl -X GET http://localhost:8080/api/accesorios

echo
echo "- Obteniendo accesorios simples:"
curl -X GET http://localhost:8080/api/accesorios/simples

echo
echo "- Obteniendo combos:"
curl -X GET http://localhost:8080/api/accesorios/combos

echo
echo "- Obteniendo accesorios disponibles:"
curl -X GET http://localhost:8080/api/accesorios/disponibles

echo
echo "- Obteniendo accesorios por tipo (Mouse):"
curl -X GET http://localhost:8080/api/accesorios/tipo/Mouse

echo
echo "========================================"
echo "    PRUEBAS COMPLETADAS"
echo "========================================"
echo
echo "Para detener la aplicacion, presiona Ctrl+C"
echo 