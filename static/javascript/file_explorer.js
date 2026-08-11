import { openWindow } from './window_manager.js';

const ROOT_SECTIONS = [
    { id: 'home',         title: 'About Me',     icon: 'computer-4.png' },
    { id: 'projects',     title: 'Projects',      icon: 'internet_options-0.png' },
    { id: 'publications', title: 'Publications',  icon: 'directory_open_file_mydocs_2k-2.png' },
    { id: 'music',        title: 'Music',         icon: 'cd_audio_cd_a-4.png' },
    { id: 'utilities',    title: 'Utilities',     icon: 'directory_admin_tools-4.png' },
    { id: 'resume',       title: 'Resume',        icon: 'notepad_file-2.png' },
];

const UTILITIES = [
    { id: 'mandelbrot',     title: 'Mandelbrot',     icon: 'paint_file-4.png' },
    { id: 'harmonograph',   title: 'Harmonograph',   icon: 'display_properties-4.png' },
    { id: 'image-to-ascii', title: 'Image to ASCII', icon: 'notepad_file-2.png' },
    { id: 'bmg-format',     title: 'BMG Format',     icon: 'directory_open_file_mydocs_2k-2.png' },
    { id: 'l5r-dice',       title: 'L5R Dice',       icon: 'joystick-4.png' },
];

export async function initFileExplorer(bodyEl) {
    const [projects, publications] = await Promise.all([
        fetch('static/json/projects.json').then(r => r.json()),
        fetch('static/json/publications.json').then(r => r.json()),
    ]);

    const projectsTree = bodyEl.querySelector('#explorer-projects-tree');
    projects.forEach(p => {
        const li = document.createElement('li');
        li.textContent = p.title;
        li.dataset.window = 'projects';
        projectsTree.appendChild(li);
    });

    const pubsTree = bodyEl.querySelector('#explorer-publications-tree');
    publications.forEach(pub => {
        const li = document.createElement('li');
        li.textContent = pub.Title;
        li.dataset.window = 'publications';
        pubsTree.appendChild(li);
    });

    showContent(bodyEl, '', projects, publications);

    const treePane = bodyEl.querySelector('.explorer-tree-pane');
    treePane.addEventListener('click', (e) => {
        const summary = e.target.closest('summary[data-folder]');
        if (!summary) return;
        const folderId = summary.dataset.folder;
        showContent(bodyEl, folderId, projects, publications);
        treePane.querySelectorAll('summary.selected').forEach(el => el.classList.remove('selected'));
        summary.classList.add('selected');
    });

    bodyEl.addEventListener('dblclick', (e) => {
        const target = e.target.closest('[data-window]');
        if (!target) return;
        const id = target.dataset.window;
        if (id) openWindow(id);
    });
}

function showContent(bodyEl, folderId, projects, publications) {
    const contentPane = bodyEl.querySelector('#explorer-content');
    contentPane.innerHTML = '';

    let items;
    if (!folderId) {
        items = ROOT_SECTIONS.map(s => ({ ...s, folder: true }));
    } else if (folderId === 'utilities') {
        items = UTILITIES.map(u => ({ ...u, folder: false }));
    } else if (folderId === 'projects') {
        items = projects.map(p => ({ id: 'projects', title: p.title, icon: 'notepad_file-2.png', folder: false }));
    } else if (folderId === 'publications') {
        items = publications.map(pub => ({ id: 'publications', title: pub.Title, icon: 'notepad_file-2.png', folder: false }));
    } else {
        const section = ROOT_SECTIONS.find(s => s.id === folderId);
        items = section ? [{ ...section, folder: true }] : [];
    }

    const base = 'https://win98icons.alexmeub.com/icons/png/';
    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'shortcut explorer-shortcut';
        li.dataset.window = item.id;
        li.innerHTML = `<img src="${base}${item.icon}" alt=""><span>${item.title}</span>`;
        contentPane.appendChild(li);
    });
}
