

export function createNode(element) {
    return document.createElement(element);
}

export function append(parent, element) {
    return parent.appendChild(element);
}


//set corresponding dropdown options to select dropdown
export function setDataToDropdown(select, data) {
    data.map(function (item) {
        let option = createNode('option');
        option.text = `${item}`;
        option.id = `${item}`;
        select.add(option);
    })
}