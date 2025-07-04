const { nanoid } = require('nanoid');
const InvariantError = require('../../exeptions/InvariantError');
const NotFoundError = require('../../exeptions/NotFoundError');

class AlbumService {
    constructor() {
        this._albums = [];
    }

    addAlbum({name, year}) {
        const id = `album-${nanoid(16)}`

        const newAlbum = {id, name, year}
        this._albums.push(newAlbum);

        const isSuccess = this._albums.filter((album) => album.id === id).length > 0;
        if (!isSuccess) {
            throw new InvariantError('Album gagal ditambahkan')
        }

        return id;
    }

    getAlbumById(id) {
        const album = this._albums.find((album) => album.id === id);
        if (!album) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        return album
    }

    editAlbumById(id, { name, year }) {
        const index = this._albums.findIndex((album) => album.id === id);

        if (index === -1) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        this._albums[index] = {
            ...this._albums[index],
            name,
            year
        };
    }

    deleteAlbumById(id) {
        const index = this._albums.findIndex((album) => album.id === id);

        if (index === -1) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        this._albums.splice(index, id)
    }
}

module.exports = AlbumService; 