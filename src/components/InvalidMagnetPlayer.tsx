export const InvalidMagnetPlayer = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[200px] text-center">
            <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                </svg>
            </div>
            <h4 className="text-lg font-semibold text-red-800 mb-2">Magnet URI no proporcionado</h4>
            <p className="text-red-600 mb-4">Se debe proporcionar un magnet URI válido para reproducir el video.</p>
        </div>
    )
}