/********************************************************************************* * 
 * WEB422 – Assignment 2 * 
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. * 
 * No part of this assignment has been copied manually or electronically from any other source * 
 * (including web sites) or distributed to other students. *
 * 
 * Name: Yushi Xie Student ID: 142358167 Date: 8-Oct-2020 * 
 * 
 * ********************************************************************************/

let saleData = [];
let page = 1;
let perPage = 10;


let saleTableTemplate = _.template(`<% _.forEach(sales, function(sale) { %>
                                        <tr data-id=<%- sale._id %>>
                                            <td><%- sale.customer.email %></td>
                                            <td><%- sale.storeLocation %></td>
                                            <td><%- sale.items.length %></td>
                                            <td><%- moment.utc(sale.saleDate).local().format('LLLL') %></td>
                                        </tr>
                                    <% }); %>`);


let saleModalBodyTemplate = _.template(`<h4>Customer</h4>
                                        <strong>email:</strong> <%- customer.email %><br />
                                        <strong>age:</strong> <%- customer.age %><br />
                                        <strong>satisfaction:</strong> <%- customer.satisfaction %> / 5 
                                        <br /><br />
                                        <h4>Items: $<%- total.toFixed(2) %></h4>
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <% _.forEach(items, function(item) { %>
                                                <tr>
                                                    <td><%- item.name %></td>
                                                    <td><%- item.quantity %></td>
                                                    <td>$<%- item.price %></td>
                                                </tr>
                                                <% }); %>
                                            </tbody>
                                        </table>`);

                                        
function loadSaleData(){
    fetch(`/api/sales?page=${page}&perPage=${perPage}`)
        .then(response => response.json())
        .then(json => {
            saleData = json.message;
            let result = saleTableTemplate({sales: saleData}); 
            $("#sale-table tbody").html(result);
            $("#current-page").html(page);
    });
}


$(function(){
    loadSaleData();

    $("#sale-table tbody").on("click","tr",function(e){
        let clickedId = $(this).attr("data-id");
        let clickedSale = _.find(saleData, ['_id', clickedId]);

        let total = 0;
        _.forEach(clickedSale.items, function(item){
            total += item.price * item.quantity;
        });

        let updatedClickedSale = {...clickedSale, total};

        $("#sale-modal .modal-title").html(`Sale: ${clickedId}`);
        $("#sale-modal .modal-body").html(saleModalBodyTemplate(updatedClickedSale));
        $("#sale-modal").modal({
            show: true, 
            backdrop: "static", 
            keyboard: false
        });
    });

    $("#previous-page").on("click", function(e) {
        if (page > 1) {
        page = page - 1;
        loadSaleData();
        }
    });
    
    $("#next-page").on("click", function(e) {
        page = page + 1;
        loadSaleData();
    });
    
});