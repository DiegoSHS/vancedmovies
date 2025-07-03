import { generateMagnetLink, generateMagnetLinks, validateMagnetLink, extractMagnetInfo } from '../magnetGenerator';
import { Torrent } from '../../features/movie/domain/entities/Torrent';

// Datos de prueba
const validTorrent: Torrent = {
    hash: 'A1B2C3D4E5F6789012345678901234567890ABCD',
    quality: '1080p',
    size: '2.5GB',
    size_bytes: 2684354560,
    url: 'https://example.com/torrent',
    type: 'web',
    is_repack: '0',
    video_codec: 'x264',
    bit_depth: '8',
    audio_channels: '2',
    seeds: 50,
    peers: 10,
    date_uploaded: '2024-01-01 00:00:00',
    date_uploaded_unix: 1704067200
};

const invalidTorrent: Torrent = {
    hash: '', // Hash vacío
    quality: '1080p',
    size: '2.5GB',
    size_bytes: 2684354560,
    url: 'https://example.com/torrent',
    type: 'web',
    is_repack: '0',
    video_codec: 'x264',
    bit_depth: '8',
    audio_channels: '2',
    seeds: 50,
    peers: 10,
    date_uploaded: '2024-01-01 00:00:00',
    date_uploaded_unix: 1704067200
};

const validMovieTitle = 'Película de Prueba';
const invalidMovieTitle = '';

console.log('=== Pruebas de Validación del Generador de Enlaces Magnet ===\n');

// Prueba 1: Generar enlace magnet válido
console.log('1. Generando enlace magnet válido:');
const magnetResult = generateMagnetLink(validTorrent, validMovieTitle);
if (magnetResult.error) {
    console.log('❌ Error:', magnetResult.error);
} else {
    console.log('✅ Éxito:', magnetResult.data);
    console.log('✅ Validación:', validateMagnetLink(magnetResult.data));
}

// Prueba 2: Torrent con hash inválido
console.log('\n2. Torrent con hash inválido:');
const invalidResult = generateMagnetLink(invalidTorrent, validMovieTitle);
if (invalidResult.error) {
    console.log('✅ Error esperado:', invalidResult.error);
} else {
    console.log('❌ No debería llegar aquí:', invalidResult.data);
}

// Prueba 3: Título de película vacío
console.log('\n3. Título de película vacío:');
const emptyTitleResult = generateMagnetLink(validTorrent, invalidMovieTitle);
if (emptyTitleResult.error) {
    console.log('✅ Error esperado:', emptyTitleResult.error);
} else {
    console.log('❌ No debería llegar aquí:', emptyTitleResult.data);
}

// Prueba 4: Torrent nulo
console.log('\n4. Torrent nulo:');
const nullTorrentResult = generateMagnetLink(null as any, validMovieTitle);
if (nullTorrentResult.error) {
    console.log('✅ Error esperado:', nullTorrentResult.error);
} else {
    console.log('❌ No debería llegar aquí:', nullTorrentResult.data);
}

// Prueba 5: Generar múltiples enlaces magnet
console.log('\n5. Generando múltiples enlaces magnet:');
const validTorrent2: Torrent = {
    hash: 'B2C3D4E5F6789012345678901234567890ABCDE1',
    quality: '720p',
    size: '1.5GB',
    size_bytes: 1610612736,
    url: 'https://example.com/torrent2',
    type: 'web',
    is_repack: '0',
    video_codec: 'x264',
    bit_depth: '8',
    audio_channels: '2',
    seeds: 30,
    peers: 5,
    date_uploaded: '2024-01-01 00:00:00',
    date_uploaded_unix: 1704067200
};

const magnetLinksResult = generateMagnetLinks([validTorrent, validTorrent2], validMovieTitle);
if (magnetLinksResult.error) {
    console.log('❌ Error:', magnetLinksResult.error);
} else {
    console.log('✅ Éxito:', magnetLinksResult.data.length, 'enlaces generados');
    magnetLinksResult.data.forEach((link, index) => {
        console.log(`  ${index + 1}. ${link.torrent.quality}: ${link.magnetLink.substring(0, 50)}...`);
    });
}

// Prueba 6: Lista de torrents vacía
console.log('\n6. Lista de torrents vacía:');
const emptyListResult = generateMagnetLinks([], validMovieTitle);
if (emptyListResult.error) {
    console.log('✅ Error esperado:', emptyListResult.error);
} else {
    console.log('❌ No debería llegar aquí:', emptyListResult.data);
}

// Prueba 7: Extraer información de enlace magnet
console.log('\n7. Extraer información de enlace magnet:');
const magnetForExtraction = generateMagnetLink(validTorrent, validMovieTitle);
if (magnetForExtraction.error) {
    console.log('❌ Error al generar enlace:', magnetForExtraction.error);
} else {
    const info = extractMagnetInfo(magnetForExtraction.data);
    console.log('✅ Información extraída:', {
        hash: info?.hash,
        name: info?.name,
        trackersCount: info?.trackers.length
    });
}

console.log('\n=== Fin de las pruebas ===');
