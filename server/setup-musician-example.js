// run mongo setup.js in terminal/cmd
db
    .musicians
    .insertMany(
        [
            { name: 'Shalom Hanoch', members: [ 'Shalom Hanoch' ], albums: [ { name: 'Album 1' }, { name: 'Album 2' } ] },
            { name: 'Michael Jackson', members: [ 'Michael Jackson' ], albums: [ { name: 'Bad' }, { name: 'Dangerous' } ] }
        ])
