import { useState, useEffect } from "react";
import moment from "moment";
import {
	Avatar,
	Indicator,
	Divider,
	Paper,
	Pagination,
	useMantineColorScheme,
	Menu,
	createStyles,
	Table,
	Button,
	Container,
	Group,
	Text,
	Anchor,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
	IconSelector,
	IconChevronDown,
	IconChevronUp,
	IconUserPlus,
	IconArrowsLeftRight,
	IconEye,
	IconDotsVertical,
	IconTrash,
	IconCircleCheck,
	IconEdit,
} from "@tabler/icons";
import UserModal from "../utils/Modal";
import AddUserForm from "../Forms/AddUserForm";
import UserTable from "../Forms/UserTable";

//Checking if user is approved
//const approved=1;

const useStyles = createStyles((theme) => ({
	inner: {
		display: "flex",
		justifyContent: "space-between",
		paddingTop: theme.spacing.xl * 4,
		paddingBottom: theme.spacing.xl * 4,
	},

	content: {
		maxWidth: 480,
		marginRight: theme.spacing.xl * 3,

		[theme.fn.smallerThan("md")]: {
			maxWidth: "100%",
			marginRight: 0,
		},
	},

	title: {
		color: theme.colorScheme === "dark" ? theme.white : theme.black,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		fontSize: 44,
		lineHeight: 1.2,
		fontWeight: 900,

		[theme.fn.smallerThan("xs")]: {
			fontSize: 28,
		},
	},

	control: {
		[theme.fn.smallerThan("xs")]: {
			flex: 1,
		},
	},

	image: {
		flex: 1,

		[theme.fn.smallerThan("md")]: {
			display: "none",
		},
	},

	highlight: {
		position: "relative",
		backgroundColor: theme.fn.variant({
			variant: "light",
			color: "#32CD32",
		}).background,
		borderRadius: theme.radius.sm,
		padding: "4px 12px",
	},
}));

const items = [
	{ title: "Dashboard", href: "#" },
	{ title: "Users", href: "#" },
].map((item, index) => (
	<Anchor href={item.href} key={index}>
		{item.title}
	</Anchor>
));

export default function UsersComponent() {
	//Delete User Confirmation.
	const DeleteModal = (user) =>
		modals.openConfirmModal({
			classNames: {
				header: "text-center",
				title:
					"w-full font-bold text-center w-full rounded-md text-red-500 font-bold",
				body: "text-center border-solid border-gray-200 rounded-md p-4",
				close: "text-white text-4xl hover:text-red-800",
				confirm: "text-center flex justify-content-center", // add justify-content-center here
			},
			title: `Delete User`,
			size: "sm",
			centered: true,
			children: (
				<Text fz="md" ta="center" className="pb-4">
					Are you sure you want to delete {`${user.firstName}`}?
				</Text>
			),
			labels: { confirm: "Yes, Delete", cancel: "No, Cancel" },

			confirmProps: { color: "red", position: "left" },
			onCancel: () => console.log(user.firstName),
			onConfirm: () => deleteUser(user._id),
		});

	const [selectedUser, setSelectedUser] = useState(null);

	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = (userId) => {
		setIsOpen(true);
	};

	const handleClose = () => {
		setSelectedUser(null);
		setIsOpen(false);
	};

	//Setting UserList states
	const [usersList, setUsersList] = useState([]);

	const fetchUsers = async () => {
		try {
			const response = await fetch("http://localhost:3008/users");
			if (!response.ok) {
				throw new Error("Error fetching users");
			}
			const users = await response.json();
			setUsersList(users);
			localStorage.setItem("usersList", JSON.stringify(users));
		} catch (err) {
			console.error(`Error fetching users: ${err.message}`);
			// Handle error
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	//
	// useEffect(() => {
	//   handleAddUser();
	// }, []);
	//Adding user function
	const handleAddUser = (newUser) => {
		setUsersList([newUser, ...usersList]);
		//Setting users to LocalStorage
		localStorage.setItem("usersList", JSON.stringify([newUser, ...usersList]));
	};

	//"Updating User function"
	const updateUser = (user) => {
		setUsersList([user, ...usersList]);
	};

	// Function to remove/Delete a user from the list
	const deleteUser = async (_id) => {
		try {
			const response = await fetch(`http://localhost:3008/user/${_id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Error deleting user");
			}

			// Remove user from usersList state and local storage
			setUsersList(usersList.filter((user) => user._id !== _id));
			const userData = localStorage.getItem("usersList");
			if (userData) {
				const parsedUserData = JSON.parse(userData);
				const updatedUserData = parsedUserData.filter(
					(user) => user._id !== _id
				);
				localStorage.setItem("usersList", JSON.stringify(updatedUserData));
			}
		} catch (err) {
			console.error(`Error deleting user: ${err.message}`);
			// Handle error
		}
	};

	const { classes } = useStyles();

	//------------------------------ADD USER MODAL---------------------------//
	const openAddUserModal = () => {
		const id = modals.open({
			classNames: {
				header: "text-center bg-primary m-3",
				title:
					"text-center w-full font-bold text-center w-full rounded-md text-white font-bold",
				body: " border border-solid border-gray-200 rounded-md p-6",
				close: "text-red-700  text-4xl hover:text-red-800",
			},
			title: (
				<Text
					ta="center"
					className="text-center w-full rounded-md text-white font-bold"
				>
					Add New User
				</Text>
			),

			size: "75%",
			children: (
				<>
					<AddUserForm addUser={handleAddUser} close={modals.closeAll} />
				</>
			),
		});
	};

	//-----------------------------ADD USER MODAL ENDS HERE--------------------------------//

	//For DAtA test Purposes--------------Merging Generated Users and Added USers//

	//---------------------- PAGINATION BLOCK-----------------------//
	//Pagination
	const [activePage, setPage] = useState(1);
	const limit = 5;
	const perPage = Math.ceil(usersList.length / limit);

	const startIndex = (activePage - 1) * limit;
	const endIndex = startIndex + limit;
	const activePageData = usersList.slice(startIndex, endIndex); // Splicing Data PerPage

	//Handling Page Change
	const handlePageChange = (newPage) => {
		setPage(newPage);
	};

	//---------------------- PAGINATION BLOCK ENDS HERE-----------------------//

	///Search functionality
	const [searchQuery, setSearchQuery] = useState("");
	const [sortField, setSortField] = useState("registeredAt");
	const [sortOrder, setSortOrder] = useState("desc");

	//filtering
	const filteredData = activePageData.filter((user) =>
		JSON.stringify(user).toLowerCase().includes(searchQuery.toLowerCase())
	);

	//Highlight Text function
	const highlightedText = (text, searchQuery) => {
		const regex = new RegExp(searchQuery, "gi");
		return text.replace(regex, (match) => `<mark>${match}</mark>`);
	};

	const Icon = sortedData
		? reversed
			? IconChevronUp
			: IconChevronDown
		: IconSelector;
	//Sorting
	const sortedData = filteredData.sort((a, b) => {
		const aValue = a[sortField];
		const bValue = b[sortField];
		if (aValue < bValue) {
			return sortOrder === "asc" ? -1 : 1;
		} else if (aValue > bValue) {
			return sortOrder === "asc" ? 1 : -1;
		} else {
			return 0;
		}
	});

	return (
		<div className="mt-16">
			<Container size="lg" px="xs">
				{/* SEarch Field */}
				<div className=" items-center px-10 max-w-md mx-auto">
					<UserTable
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
					/>
				</div>

				<div className="px-4">
					<Button
						leftIcon={<IconUserPlus size={16} />}
						variant="subtle"
						color="green"
						onClick={openAddUserModal}
						className="text-sm border-b-2 border-b-slate-700"
					>
						ADD USER
					</Button>
				</div>

				{/* Table Starts here */}
				<Table highlightOnHover className="py-4 my-4">
					<thead>
						<tr className="bg-green-100 bg-opacity-25">
							<th>Image</th>
							<th
								className="hover:bg-green-50 px-2 cursor-pointer"
								onClick={() => setSortField("firstName")}
							>
								First Name
							</th>
							<th
								className="hover:bg-green-50 px-2"
								onClick={() => setSortField("lastName")}
							>
								Last Name
							</th>
							<th
								className="hover:bg-green-50 px-2"
								onClick={() => setSortField("idType")}
							>
								ID Type/Number
							</th>
							<th onClick={() => setSortField("email")}>Email</th>
							<th
								className="hover:bg-green-50 px-2"
								onClick={() => setSortField("registeredAt")}
							>
								Reg Date
							</th>
							<th
								className="hover:bg-green-50 px-2"
								onClick={() => setSortField("verified")}
							>
								Verified
							</th>
							<th>User Details</th>
						</tr>
					</thead>
					<tbody>
						{
							sortedData.map((user, index) => (
								<tr key={user._id}>
									<td>
										<Group spacing="sm">
											<Avatar
												size={32}
												color="green"
												src={
													user.image
														? `http://localhost:3008/${user.imageUrl}`
														: null
												}
												radius="xl"
												alt={user.firstName}
												onClick={() => setSelectedUser(user)}
												className="hover:shadow-md transition duration-150 ease-in-out cursor-pointer"
											>
												{user.firstName.charAt(0)}
												{user.lastName.charAt(0)}
											</Avatar>
											<div>
												<Text fz="sm" fw={500}>
													{user.lastName}
												</Text>
												<Text fz="xs" c="dimmed" className="text-gray-300">
													{user.userRole}
												</Text>
											</div>
										</Group>
									</td>
									<td>{user.firstName}</td>
									<td>{user.lastName}</td>
									<td>{user.idType}</td>
									<td>{user.email} </td>

									<td>{moment(user.createdAt).format("MMMM Do YYYY")}</td>
									<td>
										<span className="text-primary">
											<IconCircleCheck />
										</span>
										<UserModal title="User Details">hello</UserModal>
									</td>
									<td>
										<div>
											<Menu
												transitionProps={{
													transition: "rotate-right",
													duration: 150,
												}}
												shadow="xl"
												offset={-4}
												position="left"
												width={200}
												withArrow
												arrowPosition="center"
											>
												<Menu.Target>
													<span>
														<IconDotsVertical className="hover:text-primary active:text-primary"></IconDotsVertical>
													</span>
												</Menu.Target>

												<Menu.Dropdown>
													<Menu.Label>Action</Menu.Label>
													<Menu.Item
														onClick={() => setSelectedUser(user)}
														icon={<IconEye size={14} />}
													>
														View
													</Menu.Item>
													<Menu.Item icon={<IconEdit size={14} />}>
														Edit
													</Menu.Item>
													<Menu.Divider />

													<Menu.Label>Danger zone - Careful</Menu.Label>
													<Menu.Item icon={<IconArrowsLeftRight size={14} />}>
														Transfer Data
													</Menu.Item>
													<Menu.Item
														onClick={() => DeleteModal(user)}
														color="red"
														icon={<IconTrash size={14} />}
													>
														Delete Account
													</Menu.Item>
												</Menu.Dropdown>
											</Menu>
										</div>
										{/* <span>
                          <UserModal title="User Details">body</UserModal>
                        </span> */}

										{/* <span className="px-1 mx-1"><IconTrash/></span>
                      <span>
                        {approved ? <IconUserCheck/> : "Not Approved" }
                      </span> */}
									</td>
								</tr>
							)) //Map
						}
					</tbody>
				</Table>

				<div>
					{selectedUser && (
						<UserModal
							title={`${selectedUser.firstName}'s Details`}
							isOpen={true}
							handleClose={handleClose}
						>
							<div className="px-8 py-6">
								<div className="flex items-center justify-center mb-6">
									<Indicator
										inline
										size={16}
										offset={7}
										label={selectedUser.userRole}
										position="bottom-end"
										color="green"
										withBorder
									>
										<Avatar
											src={selectedUser.imageUrl}
											alt={selectedUser.firstName}
											radius="xl"
											className="shadow-md hover:shadow-lg"
											size={68}
										/>
									</Indicator>
									<div className="ml-6">
										<h2 className="text-3xl font-bold text-primary">
											{selectedUser.firstName} {selectedUser.lastName}
										</h2>
									</div>
								</div>
								<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 ">
									<div>
										<p className="text-xl font-medium mb-1 text-gray-500">
											<Divider
												label="Contact Information"
												labelPosition="center"
												my="sm"
											/>
										</p>
										<p className="text-md list-none ml-0">
											<li className="mb-1 text-gray-600 ">
												{selectedUser.email}
											</li>
											<li className="mb-1 text-gray-600">
												{selectedUser.phone}
											</li>
											<li className="text-gray-600">
												{selectedUser.address} | {selectedUser.city}
											</li>
										</p>
									</div>

									<div>
										<p className="text-xl font-medium mb-1 text-gray-500">
											<Divider
												label="Other Info"
												labelPosition="right"
												my="sm"
											/>
										</p>
										<Paper>
											<p className="text-md list-none ml-0">
												<li className="mb-1 text-gray-600 ">
													{selectedUser.idType}
												</li>
												<li className="mb-1 text-gray-600">
													{moment(selectedUser.createdAt).format(
														"MMMM Do YYYY"
													)}
												</li>
												<li className="text-gray-600">
													{selectedUser.userRole}
												</li>
											</p>
										</Paper>
									</div>
								</div>
							</div>
						</UserModal>
					)}
				</div>
				<div className="py-2 my-1">
					<Pagination
						value={activePage}
						onChange={handlePageChange}
						position="center"
						total={perPage}
						color="green"
						className="text-primary"
						size="sm"
					/>
				</div>
			</Container>
		</div>
	);
}
