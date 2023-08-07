const express = require('express');

const db = require('../data/database');

const router = express.Router();

router.get('/', async function (req, res) {
    const query = ` 
        SELECT bbPost.*, COUNT(comment.post_id) AS comment_count
        FROM bbPost JOIN comment ON bbPost.id = comment.post_id 
        WHERE bbPost.category_id = 1 
        GROUP BY bbPost.id, bbPost.title   
        ORDER BY comment_count DESC 
        LIMIT 1;
    `;
    const query2 = ` 
        SELECT bbPost.*, COUNT(comment.post_id) AS comment_count
        FROM bbPost JOIN comment ON bbPost.id = comment.post_id 
        WHERE bbPost.category_id = 2 
        GROUP BY bbPost.id, bbPost.title   
        ORDER BY comment_count DESC 
        LIMIT 1;
    `;
    const [kboHot] = await db.query(query);
    const [MlbHot] = await db.query(query2);

    res.render('Main', { post: kboHot[0], post2: MlbHot[0] });
});

router.get('/KBO', async function (req, res) {
    const query = `
        SELECT bbPost.*, category.name AS category_name FROM bbPost 
        INNER JOIN category ON bbPost.category_id = category.id
        WHERE bbPost.category_id = 1
    `;
    const [kboPosts] = await db.query(query);
    res.render('KBO', { posts: kboPosts });
});

router.get('/MLB', async function (req, res) {
    const query = `
        SELECT bbPost.*, category.name AS category_name FROM bbPost 
        INNER JOIN category ON bbPost.category_id = category.id
        WHERE bbPost.category_id = 2
    `;
    const [MlbPosts] = await db.query(query);
    res.render('MLB', { posts: MlbPosts});
});

router.get('/:category_name/:id', async function (req, res) {
    const query = `
        SELECT * FROM bbPost WHERE id = ?
    `;

    const [posts] = await db.query(query, [req.params.id]);

    const query2 = `
        SELECT comment.* , category.name AS category_name FROM comment
        INNER JOIN category ON comment.cate_id = category.id
        WHERE comment.post_id = ?
    `;

    const [comments] = await db.query(query2, [req.params.id]);

    const postData = {
        ...posts[0],
        date: posts[0].date.toISOString(),
        humanReadableDate: posts[0].date.toLocaleDateString('ko-KR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
    };

    if (req.params.category_name === 'KBO') {
        
        res.render('KBO-detail', { 
            post: postData ,
            comments: comments
        });
    }
    else if (req.params.category_name === 'MLB') {
        res.render('MLB-detail', { 
            post: postData, 
            comments: comments
        });
    }
    
});

router.get('/:category_name/:id/edit', async function (req, res) {
    const query = `
        SELECT * FROM bbPost WHERE id = ?
    `;
    const [posts] = await db.query(query, [req.params.id]);

    if (req.params.category_name === 'KBO') {
        res.render('KBO-update', { post: posts[0] });    
    }
    else if (req.params.category_name === 'MLB') {
        res.render('MLB-update', { post: posts[0] });
    }
})

// router.get('/ETC', function (req, res) {
//     res.render('ETC', { keywords: keywords });
// })

router.get('/Post', async function(req, res) {
    const [categories] = await db.query('SELECT * FROM category');
    res.render('Post', { categories: categories});
})

router.post('/Post', async function (req, res) {
    const data = [
        req.body.category,
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.filename,
    ];
    await db.query('INSERT INTO bbPost (category_id, title, summary, body, filename) VALUES (?)', [
        data,
    ]);
    res.redirect('/');
});

router.post('/:category_name/:id/edit', async function (req, res) {
    const query = `
        UPDATE bbPost SET title = ?, summary = ?, body = ?, filename =?
        WHERE id = ?
    `;
    await db.query(query, [
        req.body.title, 
        req.body.summary, 
        req.body.content, 
        req.params.filename,
        req.params.id,
    ]);

    if (req.params.category_name === 'KBO'){
        res.redirect('/KBO');
    }
    else if (req.params.category_name === 'MLB') {
        res.redirect('/MLB');
    }
});

router.post('/:category_name/:id/delete', async function (req, res) {
    await db.query('DELETE FROM bbPost WHERE id = ?', [req.params.id]);
    await db.query('DELETE FROM comment WHERE post_id = ?', [req.params.id]);
    if (req.params.category_name === 'KBO') {
        res.redirect('/KBO');
    }
    else if (req.params.category_name === 'MLB') {
        res.redirect('/MLB');
    }
});

router.post('/', async function (req, res) {
    let keyword = req.body.keyword;
    const query = `
        SELECT * FROM bbPost 
        WHERE title LIKE ? OR
        summary LIKE ? OR
        body LIKE ?
    `;
    keyword = `%${keyword}%`;
    const [keywords] = await db.query(query, [keyword, keyword, keyword]);
    console.log(keywords);
    router.get('/ETC', function (req, res) {
        res.render('ETC', { keywords: keywords });
    });
    res.redirect('/ETC');
});

router.post('/:category_id/:id/comment', async function (req, res) {
    const comment = [
        req.params.category_id,
        req.params.id,
        req.body.content
    ]
    await db.query(`INSERT INTO comment ( cate_id, post_id, comment_content ) VALUES ( ? )`, 
        [comment]
    );
    if (req.params.category_id === '1') {
        res.redirect(`/KBO/${req.params.id}`);
    }
    else if (req.params.category_id === '2') {
        res.redirect(`/MLB/${req.params.id}`);
    }
});

module.exports = router;