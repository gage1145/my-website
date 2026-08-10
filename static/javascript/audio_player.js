export default class AudioPlayer {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.audioElem = document.createElement('audio');
        this.audioElem.classList.add('audio-player');
        this.container.appendChild(this.audioElem);
        this.currentTab = null;
        this.attachListeners();
    }

    attachListeners() {
        this.container.querySelectorAll('li[role="tab"] a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.closest('li');

                if (this.currentTab === tab && !this.audioElem.paused) {
                    this.audioElem.pause();
                    tab.removeAttribute('aria-selected');
                    this.currentTab = null;
                } else {
                    if (this.currentTab) {
                        this.currentTab.removeAttribute('aria-selected');
                    }
                    this.audioElem.src = link.getAttribute('href');
                    this.audioElem.play();
                    tab.setAttribute('aria-selected', 'true');
                    this.currentTab = tab;
                }
            });
        });

        this.audioElem.addEventListener('ended', () => {
            if (this.currentTab) {
                this.currentTab.removeAttribute('aria-selected');
                this.currentTab = null;
            }
        });
    }
}
