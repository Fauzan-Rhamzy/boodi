import { useParams } from "react-router";
import BackArrow from "../components/BackArrow";
import BookCover from "../components/BookCover";
import BookPhoto from "../components/BookPhoto";
import { Trash, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import type { Book } from "../types/book";
import toast from "react-hot-toast";
import type { SelectOption } from "../components/MultiSelectSearch";
import MultiSelectSearch from "../components/MultiSelectSearch";
import { addAuthorFromBook, getAllAuthors } from "../api/author";
import { addGenreFromBook, getAllGenres } from "../api/genre";
import { addBook } from "../api/books";

export default function BookForm() {
  const { bookId } = useParams();
  const [book, setBook] = useState<Book>();

  const [preview, setPreview] = useState(book?.cover ?? "");

  const [file, setFile] = useState<File | null>(null);

  const [originalTitle, setOriginalTitle] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const [originalAuthor, setOriginalAuthor] = useState<string>("");
  const [author, setAuthor] = useState<string>("");

  const [selectedAuthors, setSelectedAuthors] = useState<SelectOption[]>([]);

  const [originalYear, setOriginalYear] = useState<number>();
  const [year, setYear] = useState<number>(2000);

  const [originalPrice, setOriginalPrice] = useState<number>();
  const [price, setPrice] = useState<number>();

  const [originalPage, setOriginalPage] = useState<number>();
  const [page, setPage] = useState<number>();

  const [originalLang, setOriginalLang] = useState<string>();
  const [language, setLanguage] = useState<string>("");

  const [originalDesc, setOriginalDesc] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  const [originalGenre, setOriginalGenre] = useState<string>("");
  const [genre, setGenre] = useState<string>("");

  const [selectedGenres, setSelectedGenres] = useState<SelectOption[]>([]);

  const [authorOptions, setAuthorOptions] = useState<SelectOption[]>([]);
  const fetchAuthors = async () => {
    const authors = await getAllAuthors();
    setAuthorOptions(authors);
  };

  const [genreOptions, setGenreOptions] = useState<SelectOption[]>([]);
  const fetchGenres = async () => {
    const genres = await getAllGenres();
    setGenreOptions(genres);
    console.log(genres);
    console.log(genreOptions);
  };

  useEffect(() => {
    fetchAuthors();
    fetchGenres();
  }, []);

  const handleAddNewAuthor = async (name: string) => {
    try {
      const res = addAuthorFromBook(name);
      const newAuthor = { id: res.id, name };
      setAuthorOptions((prev) => [...prev, newAuthor]);
      setSelectedAuthors((prev) => [...prev, newAuthor]);
      toast.success("Author has been added");
    } catch (error) {
      toast.error("Failed to add author");
    }
  };

  const handleAddNewGenre = async (name: string) => {
    try {
      const res = await addGenreFromBook(name);
      const newGenre = { id: res.genre_id, name: name };
      setGenreOptions((prev) => [...prev, newGenre]);
      setSelectedGenres((prev) => [...prev, newGenre]);
      toast.success("Genre has been added");
    } catch (error) {
      toast.error("Failed to add genre");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleCancel = () => {
    if (bookId) {
      setAuthor(originalAuthor || "");
      setDesc(originalDesc || "");
      setGenre(originalGenre || "");
      setPrice(originalPrice || 0);
      setTitle(originalTitle || "");
      setYear(originalYear || 2000);
    }
    setFile(null);
    setPreview("");
    toast.success("Changes cancelled");
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() == "") {
      toast.error("Title should not be empty");
      return;
    }

    if (selectedAuthors.length == 0) {
      toast.error("Author should not be empty");
      return;
    }

    if (!year) {
      toast.error("Year should not be empty");
      return;
    }

    if (!price) {
      toast.error("Price should not be empty");
      return;
    }

    if (!page) {
      toast.error("Page should not be empty");
      return;
    }

    if (language.trim() == "") {
      toast.error("Pick a language");
      return;
    }

    if (desc.trim() == "") {
      toast.error("Description should not be empty");
      return;
    }

    if (selectedGenres.length == 0) {
      toast.error("Genre should not be empty");
      return;
    }

    const loading = toast.loading("Saving changes...");

    const formData = new FormData();

    if (file) {
      formData.append("cover", file);
    }

    formData.append("title", title);
    const authorIds = selectedAuthors.map((a) => a.id);
    const genreIds = selectedGenres.map((g) => g.id);
    formData.append("language", language);
    formData.append("author_ids", JSON.stringify(authorIds));
    formData.append("genre_ids", JSON.stringify(genreIds));
    formData.append("year", year.toString());
    formData.append("price", price.toString());
    formData.append("page", page.toString());
    formData.append("desc", desc);

    try {
      console.log(formData);
      const res = await addBook(formData);
      if (res) {
        toast.success("Book has been added");
      }
    } catch (error) {
      toast.error("Failed to add book");
    } finally {
      toast.dismiss(loading);
    }
  };

  const changesMade =
    originalAuthor !== author ||
    originalDesc !== desc ||
    originalGenre !== genre ||
    originalPrice !== price ||
    originalYear !== year ||
    file;

  const canAdd =
    price &&
    year &&
    title.trim() !== "" &&
    desc.trim() !== "" &&
    selectedAuthors.length !== 0 &&
    selectedGenres.length !== 0;

  return (
    <div className="w-full min-h-screen p-10 bg-bw">
      <BackArrow backPath="/admin" />
      <div className="flex justify-between items-center w-full">
        <h1 className="mt-15 font-caveat font-bold text-4xl">
          {bookId ? "Edit Book" : "Add a New Book"}
        </h1>

        {bookId && (
          <button className="mt-15 bg-red-500 text-white py-1 px-1 rounded-md font-bold hover:cursor-pointer text-[10px] p-0 flex items-center gap-2">
            <Trash size={15} /> Delete Book
          </button>
        )}
      </div>
      <div className="flex items-center justify-center h-64 mt-2">
        <BookPhoto cover={preview} />
      </div>

      <div className="flex items-center justify-center ">
        <label
          htmlFor="photoInput"
          className="flex items-center gap-2 bg-dark-green py-2 px-2 text-white text-sm pl-2 pr-2 rounded-[20px] hover:cursor-pointer"
        >
          <Upload size={16} /> Upload Book Cover
        </label>
        <input
          type="file"
          id="photoInput"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm/6 font-bold">
              Title <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="mt-1">
              <input
                id="title"
                name="title"
                required
                className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2  sm:text-sm/6"
                placeholder="Example: The Odyssey"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <MultiSelectSearch
            label={"Author"}
            options={authorOptions}
            selected={selectedAuthors}
            onSelect={(opt) => setSelectedAuthors((prev) => [...prev, opt])}
            onRemove={(id) => {
              setSelectedAuthors((prev) => prev.filter((a) => a.id !== id));
            }}
            onAddNew={handleAddNewAuthor}
          />

          <div>
            <label htmlFor="year" className="block text-sm/6 font-bold">
              Year <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="mt-1">
              <input
                id="year"
                name="year"
                type="number"
                required
                className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2  sm:text-sm/6"
                placeholder="Example: 2026"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm/6 font-bold">
              Price ($) <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="mt-1">
              <input
                id="price"
                name="price"
                type="number"
                required
                className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2  sm:text-sm/6"
                placeholder="Example: 2000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="page" className="block text-sm/6 font-bold">
              Number of Pages <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="mt-1">
              <input
                id="page"
                name="page"
                type="number"
                required
                className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2  sm:text-sm/6"
                placeholder="Example: 67"
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label htmlFor="lang" className="block text-sm/6 font-bold">
              Language <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="mt-1">
              {/* <input
                id="page"
                name="page"
                type="checkbox"
                required
                className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2  sm:text-sm/6"
                placeholder="Example: 67"
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
              /> */}
              <select
                id="lang"
                name="lang"
                required
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2  sm:text-sm/6"
              >
                <option value="" disabled>
                  Choose language...
                </option>
                <option value="id">ID – Indonesia</option>
                <option value="en">EN – English</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm/6 font-bold">
              Description <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="mt-1">
              <input
                id="description"
                name="description"
                required
                className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2  sm:text-sm/6"
                placeholder="Example: The Story of..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
          </div>

          {/* <div>
            <label htmlFor="genre" className="block text-sm/6 font-bold">
              Genre(s) <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="mt-1">
              <input
                id="genre"
                name="genre"
                type="select"
                required
                className="block w-full rounded-xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2  sm:text-sm/6"
                placeholder="Search a genre..."
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </div>
          </div> */}

          <MultiSelectSearch
            label="Genre(s)"
            placeholder="Search genre..."
            options={genreOptions}
            selected={selectedGenres}
            onSelect={(opt) => setSelectedGenres((prev) => [...prev, opt])}
            onRemove={(id) =>
              setSelectedGenres((prev) => prev.filter((g) => g.id !== id))
            }
            onAddNew={handleAddNewGenre}
          />
        </form>
      </div>

      <div className="flex gap-4 pt-4">
        {bookId && (
          <button
            type="button"
            //   disabled={!changesMade}
            //   onClick={handleCancel}
            className={`w-1/2 border-2 border-dark-green py-2 rounded-md hover:bg-gray-300 transition-colors font-bold text-dark-green ${!false && "opacity-50"} hover:cursor-pointer`}
            onClick={() => handleCancel()}
          >
            Cancel
          </button>
        )}
        <button
          disabled={!canAdd}
          className={`w-full bg-dark-green text-white py-2 rounded-md font-medium ${canAdd ? "hover:cursor-pointer" : "opacity-50"}`}
          onClick={(e) => handleSaveChanges(e)}
        >
          {bookId ? "Save Changes" : "Add Book"}
        </button>
      </div>
    </div>
  );
}
