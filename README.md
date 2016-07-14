# authorized-middleware

Checks an incoming request to see if the user has the appropriate roles

Throws an error if no `req.user` object exists

## Usage

```
import authorized from '@revolttv/authorized-middleware';

let app = new express();

app.use(authorized(['role', 'otherRole']));

app.get('/single-role', authorized('single'), (req, res) => { res.send('ok'); });
```
