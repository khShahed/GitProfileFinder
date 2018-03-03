$(function () {
    $('#search-user').on('keyup', function (e) {
        let username = e.target.value;
        if (username.length <= 0) return;
        //var startTime = performance.now();
        // Make request to Github
        $.ajax({
            url: 'https://api.github.com/users/' + username,
            data: {
                client_id: '4c6cec06e86b9d50e326',
                client_secret: '555aeb932ebfaf81472da181f99308771c480ee6'
            },
            success: function (data) {
                if (data.message != null) {
                    showNotFound();
                    return;
                }
                showProfleInfo(data);
                //var endTime = performance.now();
                //console.log((endTime - startTime) + "ms");
                $.ajax({
                    url: 'https://api.github.com/users/' + username + '/repos',
                    data: {
                        client_id: '4c6cec06e86b9d50e326',
                        client_secret: '555aeb932ebfaf81472da181f99308771c480ee6',
                        sort: 'created: asc'
                    },
                    success: function (repos) {
                        showRepos(repos);
                    },
                    cache: true
                });
            },
            error: function () {
                showNotFound();
            },
            cache: true
        });

    });
});

function showProfleInfo(user) {
    $('#profile').html(`
        <div class="card text-white bg-secondary">
          <div class="card-header">
            <h3 class="card-title">${user.name || 'Name not available'}</h3>
          </div>
          <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <img class="thumbnail avatar" src="${user.avatar_url}"/>
                        <br>
                        <br>
                        <a class="btn btn-dark btn-block" target="_blank" href="${user.html_url}">View Profile in Github</a>
                    </div>
                    <div class="col-md-9">
                        <span class="badge badge-primary"">Public Repos: ${user.public_repos}</span>
                        <span class="badge badge-warning">Public Gists: ${user.public_gists}</span>
                        <span class="badge badge-success">Followers: ${user.followers}</span>
                        <span class="badge badge-info">Following: ${user.following}</span>

                        <br>
                        <br>
                        <ul class="list-group">
                            <li class="list-group-item list-group-item-primary">Company: ${user.company || 'Company information not found'}</li>
                            <li class="list-group-item list-group-item-primary">Website/Blog: ${user.blog || 'Blog information not found'}</li>
                            <li class="list-group-item list-group-item-primary">Location: ${user.location || 'Location information not found'}</li>
                            <li class="list-group-item list-group-item-primary">Member Since: ${user.created_at}</li>
                        </ul>
                    </div>
                </div>
          </div>
        </div>
        <h3 class="page-header">Latest repos</h3>
        <div id="repos"></div>
    `);
}

function showNotFound() {
    $('#profile').html(`
        <div class="card text-white bg-danger">
          <div class="card-header">
            <h3 class="card-title">Not Found</h3>
          </div>
          <div class="card-body">
                <div class="row">
                    <p class="card-text">Username not found!</p>
                </div>
          </div>
        </div>
    `);
}

function showRepos(repos) {
    $.each(repos, function (index, repo) {
        $('#repos').append(`
            <div class="card text-white bg-info mb-3">
                <div class="card-header">
                    ${repo.name}
                    <span class="badge badge-primary"">Forks: ${repo.forks_count}</span>
                    <span class="badge badge-warning">Watchers: ${repo.watchers_count}</span>
                    <span class="badge badge-success">Stars: ${repo.stargazers_count}</span>
                </div>
                <div class="card-body">
                     ${repo.description}
                    <a class="btn btn-dark" target="_blank" href="${repo.html_url}">View in Github</a>
                </div>
            </div>
        `);
    });
}
