export default class AudioPlayer {
    constructor(selector = '.audio-player', audio = []) {
        this.playerElem = document.querySelector(selector);
        this.audio = audio;
        this.currentAudio = null;
        this.createPlayerElements();
    }

    createPlayerElements() {
        this.audioElem = document.createElement('audio');
        this.audioElem.classList.add('audio-player');
        const playListElem = document.createElement('ul');
        playListElem.classList.add('playlist');

        this.playerElem.appendChild(this.audioElem);
        this.playerElem.appendChild(playListElem);

        this.createPlaylistElements(playListElem);
    }

    createPlaylistElements(playListElem) {
        this.audio.forEach(audio => {
            const audioItem = document.createElement('li');
            const audioItemLink = document.createElement('a');
            audioItemLink.href = audio.url;
            audioItemLink.innerHTML = `<i class="fa fa-play"></i>${audio.name}`;
            this.setupEventListener(audioItemLink);
            audioItem.appendChild(audioItemLink);
            playListElem.appendChild(audioItem);
        });
    }

    setupEventListener(audioItem) {
        audioItem.addEventListener('click', (e) => {
            e.preventDefault();

            const isCurrentAudio = audioItem.getAttribute('href') === (this.currentAudio && this.currentAudio.getAttribute('href'));

            if (isCurrentAudio && !this.audioElem.paused) {
                this.setPlayIcon(this.currentAudio);
                this.audioElem.pause();
            } else if (isCurrentAudio && this.audioElem.paused) {
                this.setPauseIcon(this.currentAudio);
                this.audioElem.play();
            } else {
                if (this.currentAudio) {
                    this.setPlayIcon(this.currentAudio)
                }
                this.currentAudio = audioItem;
                this.setPauseIcon(this.currentAudio);
                this.audioElem.src = this.currentAudio.getAttribute('href');
                this.audioElem.play();
            }
        });
    }

    setPlayIcon(elem) {
        const icon = elem.querySelector('i');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }

    setPauseIcon(elem) {
        const icon = elem.querySelector('i');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    }
}