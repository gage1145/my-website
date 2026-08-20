import { openWindow } from './window_manager.js';

const ICON_BASE = 'https://win98icons.alexmeub.com/icons/png/';

const TREE = [
    { id: 'home',         title: 'Welcome',       icon: 'help_book_computer-1.png',            largeIcon: 'help_book_computer-4.png',            type: 'file' },
    { id: 'resume',       title: 'Resume',        icon: 'notepad_file-1.png',                  largeIcon: 'notepad_file-2.png',                  type: 'file' },
    { id: 'projects',     title: 'Projects',      icon: 'directory_control_panel_cool-1.png',  largeIcon: 'directory_control_panel_cool-0.png',  type: 'dir',  dynamicChildren: 'projects' },
    { id: 'publications', title: 'Publications',  icon: 'directory_open_file_mydocs_2k-1.png', largeIcon: 'directory_open_file_mydocs_2k-4.png', type: 'dir',  dynamicChildren: 'publications' },
    { id: 'music',        title: 'Music',         icon: 'cd_audio_cd_a-1.png',                 largeIcon: 'cd_audio_cd_a-4.png',                 type: 'dir',  dynamicChildren: 'music' },
    {
        id: 'utilities', title: 'Utilities', icon: 'directory_admin_tools-1.png', largeIcon: 'directory_admin_tools-4.png', type: 'dir',
        children: [
            { id: 'mandelbrot',     title: 'Mandelbrot',    icon: 'paint_file-1.png',                    largeIcon: 'paint_file-4.png',                    type: 'app' },
            { id: 'harmonograph',   title: 'Harmonograph',  icon: 'display_properties-1.png',            largeIcon: 'display_properties-4.png',            type: 'app' },
            { id: 'image-to-ascii', title: 'Image to ASCII',icon: 'notepad_file-1.png',                  largeIcon: 'notepad_file-2.png',                  type: 'app' },
            { id: 'bmg-format',     title: 'BMG Format',    icon: 'directory_open_file_mydocs_2k-1.png', largeIcon: 'directory_open_file_mydocs_2k-2.png', type: 'app' },
            { id: 'l5r-dice',       title: 'L5R Dice',      icon: 'joystick-1.png',                      largeIcon: 'joystick-4.png',                      type: 'app' },
        ],
    },
];

function findNode(id, nodes = TREE) {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNode(id, node.children);
            if (found) return found;
        }
    }
    return null;
}

function makeTreeItem(node, data) {
    const li = document.createElement('li');
    const isExpandable = node.children?.length > 0 || !!node.dynamicChildren;

    if (isExpandable) {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.dataset.folder = node.id;
        summary.innerHTML = `<img src="${ICON_BASE}${node.icon}" alt=""> ${node.title}`;
        details.appendChild(summary);

        const ul = document.createElement('ul');
        if (node.children) {
            node.children.forEach(child => ul.appendChild(makeTreeItem(child, data)));
        } else {
            (data[node.dynamicChildren] || []).forEach(item => {
                const childLi = document.createElement('li');
                childLi.dataset.window = item.window || node.id;
                childLi.textContent = item.FileName || item.title || item.Title;
                ul.appendChild(childLi);
            });
        }
        details.appendChild(ul);
        li.appendChild(details);
    } else {
        li.dataset.folder = node.id;
        li.dataset.window = node.id;
        li.innerHTML = `<img src="${ICON_BASE}${node.icon}" alt=""> ${node.title}`;
    }

    return li;
}

function buildTree(treeEl, data) {
    const rootLi = document.createElement('li');
    const rootDetails = document.createElement('details');
    rootDetails.open = true;

    const rootSummary = document.createElement('summary');
    rootSummary.dataset.folder = '';
    rootSummary.innerHTML = `<img src="${ICON_BASE}computer_2_cool-1.png" alt=""> C:/`;

    const rootUl = document.createElement('ul');
    TREE.forEach(node => rootUl.appendChild(makeTreeItem(node, data)));

    rootDetails.appendChild(rootSummary);
    rootDetails.appendChild(rootUl);
    rootLi.appendChild(rootDetails);
    treeEl.appendChild(rootLi);
}

function showContent(bodyEl, nodeId, data) {
    const contentPane = bodyEl.querySelector('#explorer-content');
    contentPane.innerHTML = '';

    let items;
    if (nodeId === '') {
        items = TREE;
    } else {
        const node = findNode(nodeId);
        if (!node) return;

        if (node.children) {
            items = node.children;
        } else if (node.dynamicChildren) {
            items = (data[node.dynamicChildren] || []).map(item => ({
                id: item.window || node.id,
                title: item.FileName || item.title || item.Title,
                link: item.Link || item.link || '',
                largeIcon: item.largeIcon || 'document-0.png',
                type: 'file',
            }));
        } else {
            items = [node];
        }
    }

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'explorer-shortcut';
        li.dataset.window = item.id;
        li.innerHTML = `<a style="text-decoration: none; color: black; text-wrap: inherit; cursor: default;" href="${item.link}"><img src="${ICON_BASE}${item.largeIcon}" alt="">${item.title}</a>`;
        contentPane.appendChild(li);
    });
}

function selectNode(treeEl, bodyEl, nodeId, data, forceOpen = false) {
    showContent(bodyEl, nodeId, data);

    treeEl.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    const target = treeEl.querySelector(`[data-folder="${nodeId}"]`);
    if (!target) return;
    target.classList.add('selected');

    let details = target.closest('details')?.parentElement?.closest('details');
    while (details) {
        details.open = true;
        details = details.parentElement?.closest('details');
    }

    if (forceOpen) {
        const ownDetails = target.closest('details');
        if (ownDetails) ownDetails.open = true;
    }
}

export async function initFileExplorer(bodyEl, initialNodeId = '') {
    const [projects, publications, music] = await Promise.all([
        fetch('static/json/projects.json').then(r => r.json()),
        fetch('static/json/publications.json').then(r => r.json()),
        fetch('static/json/music.json').then(r => r.json()),
    ]);
    const data = { projects, publications, music };

    const treeEl = bodyEl.querySelector('#explorer-tree');
    buildTree(treeEl, data);
    selectNode(treeEl, bodyEl, initialNodeId, data, true);

    treeEl.addEventListener('click', e => {
        const target = e.target.closest('[data-folder]');
        if (!target) return;
        selectNode(treeEl, bodyEl, target.dataset.folder, data);
    });

    bodyEl.addEventListener('dblclick', e => {
        const target = e.target.closest('[data-window]');
        if (!target) return;
        openWindow(target.dataset.window);
    });
}
