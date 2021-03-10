const [dragElement] = document.getElementsByClassName('ondrag-file');
const [form] = document.getElementsByClassName('form');
const [file] = document.getElementsByClassName('file');
const [fileButton] = document.getElementsByClassName('file-button');
const [text] = document.getElementsByClassName('text');
const [sendButton] = document.getElementsByClassName('send-button');
const [header] = document.getElementsByClassName('main-header');
const [nav] = document.getElementsByClassName('main-nav');

const goalItems = document.getElementsByClassName('goal-item');
const deleteItem = document.getElementsByClassName('delete-todo');
const doneItem = document.getElementsByClassName('done-item');
const filesTodoOpen = document.getElementsByClassName('files-todo');
const filesTodoClose = document.getElementsByClassName('close-files-item');
const filesItems = document.getElementsByClassName('files-item');

const filesData = [];

if (goalItems)
    for (let i = 0; i < goalItems.length; i++) {
        doneItem[i].onclick = e => {
            new Promise ((res, rej) => {
                goalItems[i].classList.toggle('done');
                setTimeout(() => { res() }, 200);
            }).then (() => {
                fetch('/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        item: i
                    })
                }).then(() => {
                    window.location.reload();
                })
            })
        }

        deleteItem[i].onclick = e => {
            fetch('/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    item: i
                })
            }).then(() => {
                window.location.reload();
            })
        }

        filesTodoOpen[i].onclick = e => {
            filesItems[i].classList.add('open')
        }

        filesTodoClose[i].onclick = e => {
            filesItems[i].classList.remove('open')
        }
    }


fileButton.onclick = e => {
    text.focus();
    file.click();
}

file.addEventListener('change', function () {
    let name = this.files[0].name;
    let content;

    const fr = new FileReader();
    fr.onload = function () {
        content = this.result;
        name = name.substring(0, name.length - 4);
        filesData.push({ name, content });
        fileButton.title = filesData.map(e => e.name).join('\n');
    };

    if (name.match(/\.txt$/)) {
        fr.readAsText(this.files[0]);
    }
})

sendButton.onclick = e => {
    fetch('/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text.value,
            files: filesData,
            done: ''
        })
    }).then(() => {
        window.location.reload();
    })
}