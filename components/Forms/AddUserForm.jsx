import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  TextInput,
  Button,
  Stepper,
  Divider,
  Group,
  Text,
  Loader,
  NativeSelect,
  useMantineTheme,
  FileInput,
  Avatar,
  Image,
  clsx,
} from "@mantine/core";
import { faker } from "@faker-js/faker";
import {
  IconUserExclamation,
  IconUpload,
  IconPhoto,
  IconX,
  IconArrowNarrowRight,
  IconArrowNarrowLeft,
} from "@tabler/icons";
import { VscOrganization, VscPerson } from "react-icons/vsc";
import UserUploads from "./UserUploads";
import IndividualProvider from "./individual/IndividualProvider";
import CorporateProvider from "./corporate/CorporateProvider";
import IndividualTwo from "./individual/IndividualTwo";
import CorporateTwo from "./corporate/CorporateTwo";
import notify from "../../lib/notify";

const AddUserForm = ({ addUser, close }) => {
  const theme = useMantineTheme();

  ///----------------------------------------STATES BLOCK----------------------------------//

  //Skills Set and State
  const [skillsSet, setSkillsSet] = useState([
    { value: "coding", label: "Coding" },
  ]);

  //Form Stepper States
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  //SeTting Select Option State
  const [selectedOption, setSelectedOption] = useState("");

  //Setting Loading State
  const [isLoading, setIsLoading] = useState(false);

  //Getting Input Ref
  const ref = useRef(null);

  //INitializing formData
  const initialFormData = {
    //Basic Form Fields
    idType: faker.helpers.arrayElement(["Ghana-Card", "VotersID", "NHIS-Card"]),
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    userRole: "CLIENT",
    password: "12345",
    image: null,
    verified: false,
    //INdividual Provider Fields
    individual: {
      idType: "",
      idNumber: "",
      skills: [],
      education: "",
      refName: "",
      refPhone: "",
      refRelation: "",
      idUploads: [],
      docUploads: [],
    },
    // //Corporate Provider Fields
    // corporate: {
    //   idType: "",
    //   idNumber: "",
    //   corpName: "",
    //   corpEmail: "",
    //   corpPhone: "",
    //   corpDate: "",
    //   corpIdUPload: [],
    //   corpDoc: [],
    // },
  };

  // Setting UserData State
  const [userData, setUserData] = useState(initialFormData);

  //Setting Error State
  const [errors, setErrors] = useState([]);

  //Setting User Provider State
  const [ProviderSelected, setProviderSelected] = useState(false);

  //Checking if user's a Provider
  useEffect(() => {
    const IsProvider = () => {
      if (userData.userRole === "PROVIDER") {
        setProviderSelected(true);
      } else {
        setProviderSelected(false);
      }
    };
    IsProvider();
  }, [userData.userRole]);

  ///Handling Form Input Change............
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "image") {
      setUserData({ ...userData, [name]: event.target.files[0] });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  //Handling Form Image
  const handleFileInput = (value) => {
    //const imageUrl = URL.createObjectURL(value);
    setUserData({ ...userData, image: value });
  };

  //Cleaning Up ObjectURL with UseEffect
  // useEffect(() => {
  //   if (userData.image) {
  //     URL.revokeObjectURL(userData.image);
  //   }
  // }, [userData.image]);

  //
  //

  // Handling Form Submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      //-----------------Using Fetch------------------//
      // const response = await fetch("http://localhost:3008/create-user", {
      //   method: "POST",
      //   body: userData,
      // });
      const response = await axios.post(
        "http://localhost:3008/create-user",
        userData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      // if (!response.ok) {
      //   throw new Error("Failed to submit form");
      // }
      // const json = await response.json();

      // Resetting the form and loading state
      setUserData(initialFormData);
      setIsLoading(false);

      //Add User Notification
      notify.success({
        message: `You've added a new user! ${response.data.firstName}`,
      });

      console.log("User Added", response.data);
      addUser(response.data);

      //Closing modal after adding user
      close();
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      // Display error message to user
      setErrors(error?.response?.data?.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <Stepper
        active={active}
        onStepClick={setActive}
        breakpoint="sm"
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Personal Info" description="Basic User Bio">
          <Group className="max-w-full mx-auto flex justify-around pt-2 mb-3">
            <TextInput
              className="w-[30%]"
              label="First Name"
              placeholder="John"
              required
              radius="lg"
              value={userData.firstName}
              onChange={handleInputChange}
              name="firstName"
            />

            <TextInput
              className="w-[30%]"
              label="Last Name"
              placeholder="Doe"
              required
              radius="lg"
              value={userData.lastName}
              onChange={handleInputChange}
              name="lastName"
            />
          </Group>

          <Group className="max-w-full mx-auto flex justify-around mb-3">
            <TextInput
              className="w-[30%]"
              radius="lg"
              label="Email"
              placeholder="John@servicehub.com"
              required
              type="email"
              value={userData.email}
              onChange={handleInputChange}
              name="email"
            />
            <TextInput
              className="w-[30%]"
              label="Phone"
              radius="lg"
              placeholder="0547-235-323"
              required
              type="tel"
              value={userData.phone}
              onChange={handleInputChange}
              name="phone"
            />
          </Group>

          <Group className="flex justify-around">
            <TextInput
              className="w-[30%]"
              label="Address"
              radius="lg"
              placeholder="Akompi Street..."
              required
              value={userData.address}
              onChange={handleInputChange}
              name="address"
            />
            <TextInput
              className="w-[30%] "
              radius="lg"
              label="City"
              placeholder="Accra"
              required
              value={userData.city}
              onChange={handleInputChange}
              name="city"
            />
          </Group>

          <Group className="py-2 my-2 justify-around">
            <NativeSelect
              className="w-[30%]"
              radius="lg"
              label="User Role"
              // description="Select user role"
              required
              icon={<IconUserExclamation size="1rem" color="green" />}
              data={[
                { value: "CLIENT", label: "Client" },
                { value: "PROVIDER", label: "Provider" },
              ]}
              value={userData.userRole}
              // onChange={(value) => console.log(value)}
              onChange={handleInputChange}
              name="userRole"
            />
            <FileInput
              ref={ref}
              radius="lg"
              className="w-[30%]"
              accept="image/*"
              onChange={(value) => setUserData({ ...userData, image: value })}
              required={true}
              name="image"
              id="image"
              label="User's Profile Photo / Logo"
              placeholder="upload photo"
              icon={<IconUpload size="1rem" color="green" />}
            />
          </Group>

          {ProviderSelected && (
            <div className="flex justify-center space-x-4 items-center">
              <div>
                <label
                  className={`bg-gray-50 shadow-md hover:bg-green-100 active:bg-green-800 w-16 h-16 rounded-full hover:shadow-2xl transition duration-150 ease-in-out text-center justify-center flex flex-col items-center cursor-pointer focus:ring-2 focus:ring-green-400 ${
                    selectedOption === "individual"
                      ? "ring-2 ring-offset-2 ring-green-400"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="individual"
                    checked={selectedOption === "individual"}
                    onChange={() => setSelectedOption("individual")}
                    className="hidden"
                  />
                  <h3 className="text-white font-semibold text-2xl">
                    <VscPerson className="text-3xl text-gray-800" />
                  </h3>
                </label>
                <p
                  className={`font-semibold ${
                    selectedOption === "individual"
                      ? "text-primary"
                      : "text-gray-800"
                  }`}
                >
                  INDIVIDUAL
                </p>
              </div>
              <div className=" w-[25%]">
                <p>
                  <Divider my="md" label="OR" labelPosition="center" />
                </p>
              </div>
              <div>
                <label
                  className={`bg-gray-50 shadow-md hover:bg-green-100 active:bg-green-800 w-16 h-16 rounded-full hover:shadow-2xl transition duration-150 ease-in-out text-center justify-center flex flex-col items-center cursor-pointer focus:ring-2 focus:ring-green-400 ${
                    selectedOption === "corporate"
                      ? "ring-2 ring-offset-2 ring-primary"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="corporate"
                    checked={selectedOption === "corporate"}
                    onChange={() => setSelectedOption("corporate")}
                    className="hidden"
                  />
                  <h3 className="text-white font-semibold text-xl">
                    <VscOrganization className="text-4xl text-gray-800" />
                  </h3>
                </label>
                <p
                  className={`font-semibold ${
                    selectedOption === "corporate"
                      ? "text-primary"
                      : "text-gray-800"
                  }`}
                >
                  CORPORATE
                </p>
              </div>
            </div>
          )}
        </Stepper.Step>

        {/* --------------------------------STAGE TWO-----------INDIVIDUAL PROVIDERS */}
        {ProviderSelected && selectedOption === "individual" ? (
          <Stepper.Step
            label="Individual Info"
            description="Identification & Referee"
          >
            <IndividualProvider
              userData={userData}
              handleInputChange={handleInputChange}
            />
          </Stepper.Step>
        ) : null}

        {ProviderSelected && selectedOption === "individual" ? (
          <Stepper.Step
            label="Individual Info"
            description="Education & Skills"
          >
            <div>
              <IndividualTwo
                userData={userData}
                handleInputChange={handleInputChange}
              />
            </div>
          </Stepper.Step>
        ) : null}

        {/* ----------------------------STAGE TWO--------------CORPORATE PROVIDER */}

        {ProviderSelected && selectedOption === "corporate" ? (
          <Stepper.Step label="Corporate Info" description="Identification">
            <CorporateProvider
              userData={userData}
              handleInputChange={handleInputChange}
            />
          </Stepper.Step>
        ) : null}
        {ProviderSelected && selectedOption === "corporate" ? (
          <Stepper.Step label="Corporate Info" description="Experiences">
            <CorporateTwo
              userData={userData}
              handleInputChange={handleInputChange}
            />
          </Stepper.Step>
        ) : null}

        {/* ---------------UPLOADS STEP----------------------------- */}
        {ProviderSelected ? (
          <Stepper.Step label="Uploads" description="IDs and Attachments">
            <div className="py-2 my-2">
              <UserUploads />
            </div>
          </Stepper.Step>
        ) : null}

        {/* ------------------------------FINAL STEPS--------------------------------- */}
        <Stepper.Completed>
          <div className="py-1 my-1">
            <p className="text-center font-medium text-lg">Review & Submit</p>
          </div>
        </Stepper.Completed>
      </Stepper>

      <Group position="center">
        <Text className="text-danger text-sm">{errors}</Text>
      </Group>

      <Group position="center" mt="sm">
        {active !== 0 ? (
          <Button
            leftIcon={<IconArrowNarrowLeft size="1rem" />}
            variant="default"
            onClick={prevStep}
          >
            Back
          </Button>
        ) : null}
        {ProviderSelected ? (
          <Button
            disabled={!selectedOption}
            rightIcon={
              active === 3 ? (
                <IconUpload size="1rem" />
              ) : (
                <IconArrowNarrowRight size="1rem" />
              )
            }
            onClick={nextStep}
          >
            {active === 4 ? "Finish" : "Next Step"}
          </Button>
        ) : (
          <Button type="submit">
            {isLoading ? <Loader size={24} /> : "Add User"}
          </Button>
        )}
      </Group>
    </form>
  );
};

export default AddUserForm;
