export function give_head() {
    var head = document.getElementsByTagName("head")[0];
    
    var utf = document.createElement('meta');
    utf.charset = "UTF-8";
    head.appendChild(utf);
    
    var title = document.createElement("title");
    title.innerHTML = "Gage Rowden";
    head.appendChild(title);
}