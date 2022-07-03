let menuStack = [];

function collapse(name, body, i) {
    if (name.classList.contains('accordion')) {
        let accordionBody = name.querySelector('.accordion-body');
        accordionBody.appendChild(body);
        return name;
    }
    let accordion = document.createElement('div');
    accordion.setAttribute("class", "accordion");

    if (name.tagName !== 'H2') {
        accordion.setAttribute("class", "child-accordion");
    }

    let acco_body = document.createElement('div');
    acco_body.setAttribute("class", "accordion-body");
    acco_body.appendChild(body);

    let checkbox = document.createElement('input');
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", "accordion-" + i);
    checkbox.setAttribute("hidden", "");

    let label = document.createElement('label');
    label.setAttribute("class", "accordion-header c-hand");
    label.setAttribute("for", "accordion-" + i);

    if (name.tagName === 'H2') {
        let strong = document.createElement('strong');
        strong.textContent = name.textContent;
        label.appendChild(strong);
    } else {
        let em = document.createElement('em');
        em.textContent = name.textContent;
        label.appendChild(em);
    }

    let icon = document.createElement('i');
    icon.setAttribute("class", "icon icon-arrow-down");
    label.appendChild(icon);

    accordion.appendChild(checkbox);
    accordion.appendChild(label);
    accordion.appendChild(acco_body);

    if (name.tagName === 'H2') {
        menuStack.push(acco_body);
        name.parentNode.replaceChild(accordion, name);
    } else {
        let parentAccordionBody = menuStack[menuStack.length - 1];
        parentAccordionBody.appendChild(accordion);
        name.parentNode.removeChild(name);
    }
}

// clear invalid syntax
function clear_invalid_syntax() {
    document.querySelectorAll('.book-menu > :not(ul):not(h1):not(h2):not(h3):not(h4):not(h5):not(h6)').forEach((e) => {
        e.parentNode.removeChild(e);
    })
}

// pack accordion
function pack_menu_accordion() {
    document.querySelectorAll('.book-menu > ul').forEach((e, idx) => {
        let sibling = e.previousElementSibling;
        let siblingStack = [];
        while (sibling != null) {
            if (!sibling || sibling.tagName === 'UL') {
                break;
            }
            if (sibling.tagName === "H1" || sibling.tagName === "H2" ||
                sibling.tagName === "H3" || sibling.tagName === "H4" ||
                sibling.tagName === "H5" || sibling.tagName === "H6") {
                siblingStack.push(sibling);
            }
            sibling = sibling.previousElementSibling;
        }
        if (!sibling || sibling.tagName === "H1") {
            siblingStack.pop();
            e.classList.add('uncollapsible');
        } else {
            for (let i = siblingStack.length - 1; i >= 0; i--) {
                let pop = siblingStack.pop();
                if (siblingStack.length === 0) {
                    // H3
                    collapse(pop, e, idx + i);
                } else {
                    // H2
                    collapse(pop, e, idx + i);
                }
            }
        }
    })
}

// highlight current tab
function highlight_current_tab() {
    document.querySelectorAll('.book-menu a').forEach((item) => {
        if (!item.getAttribute('href')) return // if href has no value
        // normalized url
        let sharp = window.location.href.search('#');
        let url = window.location.href
        if (sharp !== -1) {
            url = url.slice(0, sharp);
        }
        if (url.slice(-1) === '/') {
            url = url.slice(0, -1);
        }
        if (item.href === url) {
            item.classList.add('current-tab')
            var parent = item.parentNode;
            let parentList = [];
            while (!parent.classList.contains("book-menu")) {
                if (parent.classList.contains("accordion") || parent.classList.contains("child-accordion")) {
                    parentList.push(parent);
                }
                parent = parent.parentNode;
            }
            if (parentList.length !== 0) {
                parentList.forEach((parent) => {
                    parent.querySelector('input').setAttribute("checked", "");
                });
            }
        }
    })
}

function show_sidebar() {
    var menu = document.getElementById('menu');
    menu.classList.remove('hide');
}

/* ----- onload ----- */

clear_invalid_syntax()
pack_menu_accordion()
highlight_current_tab()
show_sidebar()

// restore sidebar position after reloading page
window.addEventListener('beforeunload', () => {
    let sidebarPos = document.querySelector('.book-menu').scrollTop
    window.localStorage.setItem('sidebarPos', sidebarPos)
})

if (window.localStorage.sidebarPos) {
    let sidebarPos = window.localStorage.sidebarPos
    document.querySelector('.book-menu').scrollTop = sidebarPos
}