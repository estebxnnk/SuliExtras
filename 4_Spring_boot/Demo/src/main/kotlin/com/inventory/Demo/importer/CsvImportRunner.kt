package com.inventory.Demo.importer

import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class CsvImportRunner(
    private val csvImportService: CsvImportService
) : CommandLineRunner {
    override fun run(vararg args: String?) {
        // Cambia la ruta si tu archivo está en otra ubicación
        csvImportService.importarDesdeCsv("C:/Users/JuanSebastianOrdonez/Documents/Inventario Final para porblado de base de datos.csv")
    }
} 