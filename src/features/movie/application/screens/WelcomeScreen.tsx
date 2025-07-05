import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";


export const WelcomeScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 items-center justify-center">
                <div className="flex items-center justify-center">
                    <h1 className="font-bold text-4xl ">
                        BOLI
                    </h1>
                    <h1 className="font-bold text-4xl text-danger">
                        Peliculas
                    </h1>
                </div>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6">
                    Tu plataforma de streaming favorita
                </p>
                <Chip size="lg" color="primary" variant="flat">
                    🎉 Completamente Gratuito
                </Chip>
            </div>

            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                    Números que Impresionan
                </h2>

                <div className="flex flex-col gap-2 items-center justify-center">
                    <div>
                        <div className="text-4xl font-bold text-primary-600 mb-2">∞</div>
                        <p className="text-gray-600 dark:text-gray-400">Películas Disponibles</p>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-secondary-600 mb-2">4K</div>
                        <p className="text-gray-600 dark:text-gray-400">Calidad de Video</p>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-success-600 mb-2">24/7</div>
                        <p className="text-gray-600 dark:text-gray-400">Disponibilidad</p>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl text-center mx-auto">
                <Button
                    radius="full"
                    color="danger"
                    size="lg"
                    variant="shadow"
                    onPress={() => navigate("/page/1")}
                >
                    🚀 Explorar Películas
                </Button>
            </div>
        </div>
    );
};
