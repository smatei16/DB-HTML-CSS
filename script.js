const main = document.getElementById("main");

var modalInputTitle = document.getElementById("modal-input-title");
var modalInputTag = document.getElementById("modal-input-tag");
var modalInputAuthor = document.getElementById("modal-input-author");
var modalInputDate = document.getElementById("modal-input-date");
var modalInputImage = document.getElementById("modal-input-image");
var modalInputContent = document.getElementById("modal-input-content");

var modalContainer = document.getElementById("modal-c");
var addButton = document.getElementById("add-b");
var cancelButton = document.getElementById("cancel-button");
var saveButton = document.getElementById("save-button");

function getArticlesFromServer() {
    fetch('http://localhost:3000/articles')
    .then(
        function(response) {
            if (response.status !== 200) {
                console.log("An error has occured: " + response.status);
                return;
            }

            response.json().then(function(response) {
                renderArticles(response);
            });
        }
    )
    .catch(function(err) {
        console.log("Fetch Error: -S", err);
    });
}

function addArticleToServer() {
    const body = {
        title: modalInputTitle.value,
        tag: modalInputTag.value,
        author: modalInputAuthor.value,
        date: modalInputDate.value,
        imgUrl: modalInputImage.value,
        saying: modalInputContent.value,
        summary: modalInputContent.value,
        content: modalInputContent.value
    }
    fetch('http://localhost:3000/articles', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(
        function() {
            getArticlesFromServer();
            resetForm();
            closeModal();
        }
    )
}

function updateArticleToServer(articleId) {
    const body = {
        title: modalInputTitle.value,
        tag: modalInputTag.value,
        author: modalInputAuthor.value,
        date: modalInputDate.value,
        imgUrl: modalInputImage.value,
        saying: modalInputContent.value,
        summary: modalInputContent.value,
        content: modalInputContent.value
    }
    fetch('http://localhost:3000/articles/' + articleId, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(
        function() {
            getArticlesFromServer();
            resetForm();
            closeModal();
        }
    )
}

function deleteArticleFromServer(articleId) {
    fetch('http://localhost:3000/articles/' + articleId, {
        method: "DELETE"
    })
    .then(
        function() {
            getArticlesFromServer();
        }
    )
}

function renderArticles(articles) {

    removeArticles();

    for(var i = 0; i < articles.length; i++) {
        var article = createArticle(articles[i]);
        main.appendChild(article);
    }
}

function createArticle(jsonArticle) {

    //article
    var article = document.createElement("article");
    article.className = "article";

    //article title
    var articleTitleContainer = document.createElement("div");
    articleTitleContainer.className = "article-title-container";
    var title = document.createElement("h1");
    title.className = "article-title";
    title.textContent = jsonArticle.title;
    articleTitleContainer.appendChild(title);
    article.appendChild(articleTitleContainer);

    //article about
    var articleAbout = document.createElement("ul");
    articleAbout.className = "article-about";
    article.appendChild(articleAbout);
    
    //article about tag
    var tag = document.createElement("li");
    tag.className = "article-about-item";
    tag.textContent = jsonArticle.tag;
    articleAbout.appendChild(tag);

    //article about added by
    var addedBy = document.createElement("li");
    addedBy.className = "article-about-item";
    addedBy.textContent = "Added by";
    articleAbout.appendChild(addedBy);

    //article about author
    var author = document.createElement("span");
    author.className = "article-author";
    author.textContent = jsonArticle.author;
    addedBy.appendChild(author);
    articleAbout.appendChild(author);

    //article about date
    var date = document.createElement("li");
    date.className = "article-about-item";
    date.textContent = jsonArticle.date;
    articleAbout.appendChild(date);

    //article edit/delete buttons container
    var editDeleteContainer = document.createElement("ul");
    editDeleteContainer.className = "edit-delete-container";
    article.appendChild(editDeleteContainer);

    //edit button
    var editButtonContainer = document.createElement("li");
    editButtonContainer.className = "edit-delete-item";
    editDeleteContainer.appendChild(editButtonContainer);
    var editButton = document.createElement("button");
    editButton.className = "edit-delete-button";
    editButton.textContent = "Edit";
    editButton.addEventListener('click', function() {openEditModal(jsonArticle);});
    editButtonContainer.appendChild(editButton);

    var aux = document.createElement("li");
    aux.className = "edit-delete-item";
    aux.textContent = "|";
    editDeleteContainer.appendChild(aux);

    //delete button
    var deleteButtonContainer = document.createElement("li");
    deleteButtonContainer.className = "edit-delete-item";
    editDeleteContainer.appendChild(deleteButtonContainer);
    var deleteButton = document.createElement("button");
    deleteButton.className = "edit-delete-button edit-delete-last";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener('click', function() {deleteArticleFromServer(jsonArticle.id);});
    deleteButtonContainer.appendChild(deleteButton);

    //image
    var img = document.createElement("img");
    img.className = "article-image";
    img.src = jsonArticle.imgUrl;
    article.appendChild(img);

    //content
    var contentContainer = document.createElement("div");
    contentContainer.className = "article-text-container";
    article.appendChild(contentContainer);
    var articleText = document.createElement("p");
    articleText.className = "article-text";
    articleText.textContent = jsonArticle.content;
    contentContainer.appendChild(articleText);

    return article;
}

function removeArticles() {
    while(main.firstChild) {
        main.removeChild(main.lastChild);
    }
}

function openAddModal() {
    modalContainer.className = "modal-container active";
    clearSave();
    saveButton.addEventListener('click', addArticleToServer);
}

function openEditModal(article) {
    modalContainer.className = "modal-container active";
    modalInputTitle.value = article.title;
    console.log(article);
    modalInputTag.value = article.tag;
    modalInputAuthor.value = article.author;
    modalInputDate.value = article.date;
    modalInputImage.value = article.imgUrl;
    modalInputContent.value = article.content;
    clearSave();
    saveButton.addEventListener('click', function() {updateArticleToServer(article.id);});
}

function closeModal() {
    modalContainer.className = "modal-container";
}

function clearSave() {
    var newButton = saveButton.cloneNode(true);
    saveButton.parentNode.replaceChild(newButton, saveButton);
    saveButton = document.getElementById("save-button");
}

function resetForm() {
    modalInputTitle.value = "";
    modalInputTag.value = "";
    modalInputAuthor = "";
    modalInputDate = "";
    modalInputImage = "";
    modalInputContent = "";
}

addButton.addEventListener('click', openAddModal);
cancelButton.addEventListener('click', closeModal);

getArticlesFromServer();