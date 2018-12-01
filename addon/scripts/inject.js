$(".save-listing-element").each(function() {
    $(this).before(function() {
        return $('<span class="iconic iconic-star ignore-company iconic-sm mr--xxs" title="delete" aria-hidden="true"></span>').click(function(e) {
            e.preventDefault();
            let row = $(this).parents("article.job-element");
            let id = getCompanyID(row);
            row.fadeOut();
            ignoreCompany(id);
        })
    });
})

// $("a").on("click", ".ignore-company", function(e) {
//     e.preventDefault();
//     console.log("clicked ignore!");
//     let id = getCompanyID($(this).parents("article.job-element"));
//     console.log(id);
//     ignoreCompany(id);
// });

let gettingItem = browser.storage.sync.get("ignored").then((item) => {
    $("article.job-element").each(function(e) {
        if(item.ignored.includes(getCompanyID($(this)))) {
            $(this).hide();
        }
    });
}, (error) => {
    console.log("error!");
});

function ignoreCompany(id) {
    let gettingItem = browser.storage.sync.get("ignored").then((item) => {
        if(item == {})
            item = {
                ignored: new Array()
            }
        let ignored_set = new Set(item.ignored);
        ignored_set.add(id);
        browser.storage.sync.set({
            ignored: Array.from(ignored_set)
        });
        console.log("Ignored " + id);


    }, (error) => {
        console.log("error!");
    });
}

function getCompanyID(el) {
    var cid_re = /\/cmp\/de\/.+?-(\d+)\/jobs\.html/g;
    var href = el.find(".js-company-logo-click-trigger").attr("href");
    var id = parseInt(cid_re.exec(href)[1])
    return id;
}