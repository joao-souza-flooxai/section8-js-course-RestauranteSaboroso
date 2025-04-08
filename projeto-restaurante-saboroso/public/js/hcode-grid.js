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
            btnUpdate: 'btn-update',
            btnDelete: 'btn-delete',
            onUpdateLoad: (form, name, data) => {
                console.log("onUpdateLoad called", { name, data });
                let input =  form.querySelector('[name=' + name + ']');
                if(input) input.value = data[name];
            }
        }, configs);
    
        this.formCreate = document.querySelector(this.options.formCreate);
        this.formUpdate = document.querySelector(this.options.formUpdate);
        this.rows = [...document.querySelectorAll('table tbody tr')];
    
        this.initForms();
        this.initButtons();
    }
    

    initForms() {

        if (this.formCreate) {
            this.formCreate.save({
                success: () => {
                    this.fireEvent('afterFormCreate');
                },
                failure: () => {
                    this.fireEvent('afterFormCreateError');
                }
            });
        }

        if (this.formUpdate) {
            this.formUpdate.save({
                success: () => {
                    this.fireEvent('afterFormUpdate');
                },
                failure: () => {
                    this.fireEvent('afterFormUpdateError');
                }
            });
        }

    }

    fireEvent(name, args) {
        if (typeof this.options.listeners[name] === 'function') 
            this.options.listeners[name].apply(this, args);
        
    }


    btnUpdateClick(e){
        this.fireEvent('beforeUpdateClick', [event]);

            let tr = event.target.closest('tr');

            if (!tr) return; 

            let data = JSON.parse(tr.dataset.row);

            for (let name in data) {

                this.options.onUpdateLoad(this.formUpdate, name, data);
                
            }

            //abre o form update
        this.fireEvent('afterUpdateClick', [event]);
    }

    btnDeleteClick(e){

        console.log("chegou aqui hcode-grid");
        this.fireEvent('beforeUpdateClick');
        
        let tr = event.target.closest('tr');

        if (!tr) return; 

        let data = JSON.parse(tr.dataset.row);

        if (confirm("Deseja realmente excluir?")) {

            const url = this.options.deleteUrl.replace('${data.id}', data.id);
            console.log(url);
            fetch(url, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(json => {
                this.fireEvent('afterDeleteClick');
            });
        }
    }
    
    getTrData(e) {
       
        let tr = e.target.closest('tr');
    
        if (!tr) return null;
  
        return JSON.parse(tr.dataset.row);
    }

    initButtons(){
       
        this.rows.forEach(row => {
            [...row.querySelectorAll('.btn')].forEach(btn => {
                btn.addEventListener('click', e => {
                    if (e.target.classList.contains(this.options.btnUpdate)) {
                        this.btnUpdateClick(e);
                    } else if (e.target.classList.contains(this.options.btnDelete)) {
                        this.btnDeleteClick(e);
                    } else {
                        this.fireEvent('buttonClick', [e.target, this.getTrData(e), e]);
                    }
                });
            });
        });


    }
}