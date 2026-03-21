export function give_head() {
    var head = document.getElementsByTagName("head")[0];
    
    var utf = document.createElement('meta');
    utf.charset = "UTF-8";
    head.appendChild(utf);
    
    var viewport = document.createElement('meta');
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1.0";
    head.appendChild(viewport);
    
    var title = document.createElement("title");
    title.innerHTML = "Gage Rowden";
    head.appendChild(title);
    
    var favicon = document.createElement("link");
    favicon.href = "static/images/favicon.ico";
    favicon.rel = "icon";
    head.appendChild(favicon);
}