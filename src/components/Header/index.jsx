import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';

export const Header = () => {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);

	const onClickLogout = () => {
		if (window.confirm('Are you sure you want to sign out?')) {
			dispatch(logout());
		}
	};

	return (
		<div className={styles.root}>
			<Container maxWidth="lg">
				<div className={styles.inner}>
					<Link className={styles.logo} to="/">
						<div>FRONT END BLOG</div>
					</Link>
					<div className={styles.buttons}>
						{isAuth ? (
							<>
								<Link to="/add-post">
									<Button variant="contained">Write a post</Button>
								</Link>
								<Button
									onClick={onClickLogout}
									variant="contained"
									color="error"
								>
									Sign out
								</Button>
							</>
						) : (
							<>
								<Link to="/login">
									<Button variant="outlined">Sign in</Button>
								</Link>
								<Link to="/register">
									<Button variant="contained">Register</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</Container>
		</div>
	);
};
