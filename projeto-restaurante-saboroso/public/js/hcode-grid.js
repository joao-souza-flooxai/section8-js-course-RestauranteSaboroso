class HcodeGrid{
    constructor(configs) {

        configs.listeners = Object.assign({
            afterUpdateClick: (e) => {
                $('#modal-update').modal("show");
            },
            afterDeleteClick: (e) => {
                window.location.reload();
            }, 
            afterFormCreate: (e) => {
                window.location.reload();
            },
            afterFormUpdate: (e) => {
                window.location.reload();
            }, 
            afterFormUpdateError: (e) =>{
                console.log(e);
                alert("Error ao enviar o formulário");
            },
            afterFormCreateError: (e) =>{
                console.log(e);
                alert("Error ao enviar o formulário");
            }
        }, configs.listeners);

        this.options = Object.assign({}, {
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: '.btn-update',
            btnDelete: '.btn-delete'
        }, configs);
    
        this.formCreate = document.querySelector(this.options.formCreate);
        this.formUpdate = document.querySelector(this.options.formUpdate);
    
        this.initForms();
        this.initButtons();
    }
    

    initForms() {
        this.formCreate.save().then(json => {
            this.fireEvent('afterFormCreate');
        }).catch(err => {
            this.fireEvent('afterFormCreateError');
        });
    
        this.formUpdate.save().then(json => {
            this.fireEvent('afterFormUpdate');
        }).catch(err => {
            this.fireEvent('afterFormUpdateError');
        });
    }

    fireEvent(name, args) {
        if (typeof this.options.listeners[name] === 'function') 
            this.options.listeners[name].apply(this, args);
        
    }

    

    initButtons(){
       

        [...document.querySelectorAll(this.options.btnUpdate)].forEach(btn => {
            btn.addEventListener('click', event => {

            this.fireEvent('beforeUpdateClick', [event]);

            let tr = event.target.closest('tr');

            if (!tr) return; 

            let data = JSON.parse(tr.dataset.row);

            for (let name in data) {

                let input = this.formUpdate.querySelector(`[name=${name}]`);


                switch (name) {
                    case 'date':
                    if (input) input.value = moment(data[name]).format('YYYY-MM-DD');
                    break;
                    default:
                    if (input) input.value = data[name];
                    break;
                }
            }

            //abre o form update
            this.fireEvent('afterUpdateClick', [event]);

            });
        });

        [...document.querySelectorAll(this.options.btnDelete)].forEach(btn => {

            this.fireEvent('beforeUpdateClick');
            btn.addEventListener('click', event => {

            let tr = event.target.closest('tr');

                if (!tr) return; 

                let data = JSON.parse(tr.dataset.row);

                if (confirm("Deseja realmente excluir?")) {

                    const url = this.options.deleteUrl.replace('${data.id}', data.id);

                    fetch(url, {
                        method: 'DELETE'
                    })
                    .then(response => response.json())
                    .then(json => {
                        this.fireEvent('afterDeleteClick');
                    });
                }
            });

        });
    }
}