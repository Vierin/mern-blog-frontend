import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from '../../axios';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export const AddPost = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isAuth = useSelector(selectIsAuth);

	const [isLoading, setLoading] = useState(false);
	const [text, setText] = useState('');
	const [title, setTitle] = useState('');
	const [tags, setTags] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const inputFileRef = useRef(null);

	const isEditing = Boolean(id);

	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			const file = event.target.files[0];
			formData.append('image', file);

			const { data } = await axios.post('/upload', formData);
			setImageUrl(data.url);
		} catch (error) {
			console.warn(error);
		}
	};

	const onClickRemoveImage = () => {
		setImageUrl('');
	};

	const onChange = useCallback((txt) => {
		setText(txt);
	}, []);

	const onSubmit = async () => {
		try {
			setLoading(true);

			const fields = {
				title,
				text,
				imageUrl,
				tags,
			};

			const { data } = isEditing
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post(`/posts/`, fields);

			const _id = isEditing ? id : data._id;

			navigate(`/posts/${_id}`);
		} catch (error) {
			console.warn(error);
			alert('Failed to create post');
		}
	};

	useEffect(() => {
		if (id) {
			axios
				.get(`/posts/${id}`)
				.then(({ data }) => {
					setTitle(data.title);
					setText(data.text);
					setImageUrl(data.imageUrl);
					setTags(data.tags.join(', '));
					console.log(data);
				})
				.catch((err) => {
					console.log('Error while fetching post');
				});
		}
	}, []);

	const options = useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Введите текст...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	);

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to="/" />;
	}
	console.log(imageUrl);
	return (
		<Paper style={{ padding: 30 }}>
			<Button
				onClick={() => inputFileRef.current.click()}
				variant="outlined"
				size="large"
			>
				Load preview
			</Button>
			<input
				type="file"
				ref={inputFileRef}
				onChange={handleChangeFile}
				hidden
			/>
			{imageUrl && (
				<>
					<Button
						variant="contained"
						color="error"
						onClick={onClickRemoveImage}
					>
						Delete
					</Button>
					<img
						className={styles.image}
						src={`http://localhost:4444${imageUrl}`}
						alt="Uploaded"
					/>
				</>
			)}
			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant="standard"
				value={title}
				placeholder="Title..."
				onChange={(e) => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant="standard"
				value={tags}
				placeholder="Tags..."
				onChange={(e) => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size="large" variant="contained">
					{isEditing ? 'Save' : 'Publish'}
				</Button>
				<a href="/">
					<Button size="large">Cancel</Button>
				</a>
			</div>
		</Paper>
	);
};
