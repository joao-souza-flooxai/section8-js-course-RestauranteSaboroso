const conn = require('./db');


class Pagination {

    constructor(query, params = [], itemsPerPage = 10) {
        this.query = query;
        this.params = params;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1; 
    }



    getPage(page = 1) {
        this.currentPage = Number(page) - 1;
        this.itemsPerPage = this.itemsPerPage || 10; // valor padrão
        this.params.push(
            this.currentPage * this.itemsPerPage,
            this.itemsPerPage
        );
    
        return new Promise((resolve, reject) => {
            conn.query([this.query, "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(";"), this.params, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    this.data = results[0];
                    this.total = results[1][0].FOUND_ROWS;
                    this.totalPages = Math.ceil(this.total / this.itemsPerPage);
                    this.currentPage++;
                    resolve(this.data);
                }
            });
        });
    }
    


    getTotal() {
        return this.total;
    }
    
    getCurrentPage() {
        return this.currentPage;
    }
    
    getTotalPages() {
        return this.totalPages;
    }

    getNavigation(params) {
        let limitPageNav = 5;
        let links = [];

        let nrstart = 0;
        let nrend = 0;

        if (this.getTotalPages() < limitPageNav) {
            limitPageNav = this.getTotalPages();
        }

        // Se estamos nas primeiras páginas
        if ((this.getCurrentPage() - parseInt(limitPageNav / 2)) < 1) {
            nrstart = 1;
            nrend = limitPageNav;
        }
        // Estamos chegando nas últimas páginas
        else if ((this.getCurrentPage() + parseInt(limitPageNav / 2)) > this.getTotalPages()) {
            nrstart = this.getTotalPages() - limitPageNav;
            nrend = this.getTotalPages();
        } else {
            nrstart = this.getCurrentPage() - parseInt(limitPageNav / 2);
            nrend = this.getCurrentPage() + parseInt(limitPageNav / 2);
        }
        
        for (let x = nrstart; x <= nrend; x++) {
            links.push({
                text: x,
                href: `?` + this.getQueryString(Object.assign({},params,{page: x})),
                active: (x === this.getCurrentPage())
            });
        }

        return links;
    }


    getQueryString(params){

        let queryString = [];
        for (let name in params) {
            queryString.push(`${name}=${params[name]}`);
        }

        return queryString.join("&");

    }

}



module.exports = Pagination;