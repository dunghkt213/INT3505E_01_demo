from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Model
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    available = db.Column(db.Boolean, default=True)

# Tạo database
with app.app_context():
    db.create_all()

# Trang chủ
@app.route('/')
def index():
    books = Book.query.all()
    return render_template('index.html', books=books)

# Thêm sách
@app.route('/add', methods=['POST'])
def add_book():
    title = request.form['title']
    author = request.form['author']
    new_book = Book(title=title, author=author, available=True)
    db.session.add(new_book)
    db.session.commit()
    return redirect(url_for('index'))

# Mượn sách
@app.route('/borrow/<int:id>')
def borrow_book(id):
    book = Book.query.get(id)
    if book and book.available:
        book.available = False
        db.session.commit()
    return redirect(url_for('index'))

# Trả sách
@app.route('/return/<int:id>')
def return_book(id):
    book = Book.query.get(id)
    if book and not book.available:
        book.available = True
        db.session.commit()
    return redirect(url_for('index'))

# Xóa sách
@app.route('/delete/<int:id>')
def delete_book(id):
    book = Book.query.get(id)
    if book:
        db.session.delete(book)
        db.session.commit()
    return redirect(url_for('index'))

if __name__ == "__main__":
    app.run(debug=True)
