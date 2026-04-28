import { Chip, Link } from "@heroui/react";

export const WelcomeScreen: React.FC = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 items-center justify-center">
                <div className="flex items-center justify-center">
                    <h1 className="font-bold text-4xl ">
                        BOLI
                    </h1>
                    <h1 className="font-bold text-4xl text-red-600">
                        Peliculas
                    </h1>
                </div>
                <p className="text-xl md:text-2xl mb-6">
                    Tu plataforma de streaming favorita
                </p>
                <Chip size="lg" color="default" variant="primary" className="inline-flex items-center">
                    <Chip.Label>🎉 Completamente Gratuito</Chip.Label>
                </Chip>
            </div>

            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8">
                    Números que Impresionan
                </h2>

                <div className="flex flex-col gap-2 items-center justify-center">
                    <div>
                        <p>Películas Disponibles</p>
                        <div className="text-4xl font-bold text-cyan-500 mb-2">∞</div>
                    </div>
                    <div>
                        <p>Calidad de Video</p>
                        <div className="text-4xl font-bold text-purple-500 mb-2">4K</div>
                    </div>
                    <div>
                        <p>Disponibilidad</p>
                        <div className="text-4xl font-bold text-pink-500 mb-2">24/7</div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl text-center mx-auto">
                <Link
                    href="/page/1"
                    className="no-underline button bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-red-600"
                >
                    Explorar Películas
                </Link>
            </div>
        </div>
    );
};
