package com.inventory.Demo

import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean

@SpringBootApplication
class DemoApplication {
    @Bean
    fun showSwaggerUrl(): CommandLineRunner = CommandLineRunner {
        println("--------------------------------------------------")
        println("¡Aplicación iniciada con éxito!")
        println("Accede a Swagger UI en: http://localhost:8080/swagger-ui/index.html")
    }
}

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
