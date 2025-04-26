import axios from "axios";
import { toast } from "react-toastify";
import data from "bootstrap/js/src/dom/data";

// URL của API backend
const API_URL = "http://localhost:8081/api";

export const getUsers = async (tokens, page = 0, size = 10) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/users/pagination?page=${page}&size=${size}&salaryMin=0`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Trả về đối tượng phân trang
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
export const checkPhoneNumber = async (numberphone) => {
    try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await axios.get(`http://localhost:8081/check-phone?numberphone=${numberphone}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Thêm token vào request
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi kiểm tra số điện thoại:", error);
        return error.response?.data?.message || "Có lỗi xảy ra";
    }
};

export const checkPhoneNumber1 = async (numberphone) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `http://localhost:8081/api/check-phone?numberphone=${numberphone}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        // Đảm bảo trả về message chính xác
        return response.data.message;
    } catch (error) {
        console.error("Lỗi khi kiểm tra số điện thoại:", error);
        return null; // Trả về null nếu có lỗi
    }
};
export const checkUsernameExists1 = async (username) => {
    try {
        const response = await fetch(`http://localhost:8081/api/check-username?username=${username}`);

        // Kiểm tra nếu phản hồi không có nội dung, tránh lỗi JSON
        if (!response.ok) {
            return "Tên đăng nhập đã tồn tại";
        }

        const data = await response.json();
        console.log("Response từ API:", data); // Debug response

        return data.message; // Trả về message của API
    } catch (error) {
        console.error("Lỗi kiểm tra username:", error);
        return "Lỗi khi kiểm tra tên đăng nhập";
    }
};




// Hàm kiểm tra xem tên đăng nhập có tồn tại không
export const checkUsernameExists = async (username, tokens) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const usernames = response.data.map(user => user.username); // Lấy danh sách tên đăng nhập

        return usernames.includes(username); // Kiểm tra xem tên đăng nhập có trong danh sách không
    } catch (error) {
        console.error("Error checking username existence:", error);
        // Trả về false để không có lỗi nếu có lỗi xảy ra
        return false;
    }
};

export const checkEmailExists = async (email) => {
    const token = localStorage.getItem('token'); // Lấy token nếu cần thiết
    try {
        const response = await axios.get(`http://localhost:8081/api//email/check-email`, {
            params: { email: email },
            headers: {
                Authorization: `Bearer ${token}`, // Gửi token trong header nếu cần thiết
            },
        });

        // Nếu trả về 400, tức là email đã tồn tại
        return response.status === 200; // trả về true nếu email có thể sử dụng
    } catch (error) {
        console.error("Error checking email existence:", error);
        return false; // Trả về false nếu có lỗi
    }
};
// Hàm kiểm tra xem email có tồn tại không
export const checkEmailExists1 = async (email) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `http://localhost:8081/api/email/check-email`,
            {
                params: { email: email },
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return response.data.message; // Trả về thông báo từ API
    } catch (error) {
        console.error("Lỗi khi kiểm tra email:", error);
        return null; // Trả về null nếu có lỗi
    }
};

export const checkEmailExistsForUpdate = async (email, userId, tokens) => {
    try {
        // Gọi hàm getUsers để lấy danh sách người dùng
        const users = await getUsers(tokens, 0, 10); // Lấy danh sách người dùng với page=0 và size=10 (có thể thay đổi tùy nhu cầu)

        // Kiểm tra xem email có tồn tại cho một user khác không
        const exists = users.content.some(user => user.email === email && user.id !== userId);

        return exists; // Trả về true nếu email đã tồn tại cho user khác, ngược lại false
    } catch (error) {
        console.error("Error checking email existence:", error);
        return false; // Trả về false nếu có lỗi xảy ra
    }
};

export const checkNumberPhonneExistsForUpdate = async (numberphone, userId, tokens) => {
    try {
        // Gọi hàm getUsers để lấy danh sách người dùng
        const users = await getUsers(tokens, 0, 50); // Lấy danh sách người dùng với page=0 và size=10 (có thể thay đổi tùy nhu cầu)

        // Kiểm tra xem số điện thoại có tồn tại cho một user khác không
        const exists = users.content.some(user => user.numberphone === numberphone && user.id !== userId);

        return exists; // Trả về true nếu số điện thoại đã tồn tại cho user khác, ngược lại false
    } catch (error) {
        console.error("Error checking numberphone existence:", error);
        return false; // Trả về false nếu có lỗi xảy ra
    }
};

export const checkNumberphoneExists = async (numberphone) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`http://localhost:8081/api/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response || !response.data) {
            console.error("API trả về dữ liệu không hợp lệ", response);
            return false;
        }

        const numberphones = response.data.map(user => user.numberphone);
        const exists = numberphones.includes(numberphone);
        console.log(`Số điện thoại ${numberphone} có tồn tại:`, exists);

        return exists;
    } catch (error) {
        console.error("Lỗi kiểm tra số điện thoại:", error);
        return false; // Đảm bảo return false nếu có lỗi, tránh undefined
    }
};

// Hàm gọi API để thêm mới nhân viên
export const saveEmployeeToAPI = async (values, tokens) => { // Đổi tên hàm này
    console.log("đã vào service thêm mới nhân viên ");

    const token = localStorage.getItem('token');
    console.log(values);

    try {
        const response = await axios.post(`http://localhost:8081/api/users`, values, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 201) {
            toast.success("Thêm mới nhân viên thành công!");
            return response.data;
        }
    } catch (error) {
        console.error("Error adding employee:", error);
        toast.error("Lỗi khi thêm mới nhân viên: " + error.response?.data?.message || error.message);
        throw error;
    }
};
// Hàm gọi API để tìm kiếm người dùng
export const searchUsers = async (userName, fullName, numberPhone, token, page = 0, size = 10) => {
    try {
        const params = {
            userName,
            fullName,
            numberPhone,
            page,
            size,
        };

        const response = await axios.get(`${API_URL}/users/search`, {
            params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // Trả về đối tượng phân trang
    } catch (error) {
        console.error("Error searching users:", error);
        throw error;
    }
};



export const updateUser = async (userId, userData, tokens) => {
    const token = localStorage.getItem('token')
    const response = await axios.put(`http://localhost:8081/api/users/update/${userId}`, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return response.data;
};
// Hàm gọi API để lấy thông tin người dùng theo ID
export const getUserById = async (userId, tokens) => {
    const token = localStorage.getItem('token')
    try {
        const response = await axios.get(`http://localhost:8081/api/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Trả về thông tin người dùng
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
};
// Hàm gọi API để xóa người dùng theo ID
export const deleteUser = async (userId, tokens) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.delete(`${API_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 204) {
            return true;
        }
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Lỗi khi xóa người dùng: " + error.response?.data?.message || error.message);
        throw error;
    }
};


/**
 *
 * @param {*} users đây là thông tin người dùng
 * @returns trả về các trạng thái để chuyển qua xác thực mã code gmail => chưa lưu vào database
 *           trả về các trạng thái nhất định  400  vd: số điện thoại đã tồn tịa
 */
const CreateAccount = async (users) => {
    try {
        console.log("Đã đi vào phần tạo tài khoản");

        users = {...users,
            address: "chưa có địa chỉ",
            roleId: 1,
            salary : 0,
            isActive: true
        }
        delete users.confirmPassword // xóa phần xác nhận mật khẩu
        const respone = await axios.post(`http://localhost:8081/api/user/register`,users);
        return respone.data;
    } catch (errors) {
        if (errors.response && errors.response.status === 400) {
            console.log("lỗi rồi đó");
            return errors.response.data;
        }else {
            console.log("Lỗi không xác định", errors);
            throw errors ;
        }
    }
}

/**
 *
 * @param {*} email gửi email đi để validate coi có tồn tại trong database hay không
 * @returns trả về trạng thái 200 nếu thành công => true
 *          đã có email trong database thì => false
 */
const SendCodeEmail = async (email) => { // kiểm tra mail có tồn tại ở trong thực tế hay không
    try {
        const response = await axios.post(`http://localhost:8081/api/email/send-code-email?email=${email}`);
        return true;
    } catch (error) {
        // In ra lỗi nếu có
        return false
    }
}

/**
 *
 * @param {*} oldPassword mật khẩu cũ
 * @param {*} newPassword mật khẩu mới
 * @returns trả về trạng thái  200 nếu thành công
 *          nếu xảy ra lỗi thì trả về các lỗi 400 401 tương ứng rồi hiển thị lên cho người dùng xem
 */
const changePassword = async (oldPassword,newPassword) => {
    console.log("Đã đi vào changePassword ");

    const token = localStorage.getItem('token')

    try {
        const response = await axios.get(`http://localhost:8081/api/verify/change-password`,
            {headers:
                    {
                        'Authorization': `Bearer ${token}`
                    },
                params:{
                    oldPassword : oldPassword,
                    newPassword : newPassword
                }
            }
        );
        return response.data;
    } catch (error) {

        return error.response;
    }
}


/**
 *
 * @param {*} code đây là mã người dùng nhập vào để kiểm tra lúc đăng nhập và xác nhận tài khoản đó đã tồn tại hay ko
 * @param {*} email đây là email người dùng
 * @returns trả về true nếu thành công và sẽ chuyển trang nếu xác thực code thành công
 *          trả về false nếu như sai mã code
 */
const GetCode = async (code, email) => {
    console.log("Đã đi vào GetCode");

    try {
        const response = await axios.post(`http://localhost:8081/api/email/check-code?code=${code}&email=${email}`);

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            return false;
        }
        console.log(error.response.data);
    }
    return false;
}
/**
 *
 * @param {*} username đây là username
 * @param {*} password đây là pasword
 * @returns trả về token và token này sẽ tự động thêm trong Component => Login
 *          xảy ra các lỗi 404 500 và 400 thì lấy lên kiểm tra
 */

const Login = async (username, password) => {
    console.log("Đã đi vào phần Login");

    try {
        const respone = await axios.post(`http://localhost:8081/api/login`, {
            username: username, // Sử dụng tham số username
            password: password  // Sử dụng tham số password
        });

        // Lưu thông tin vào localStorage
        localStorage.setItem('roles', JSON.stringify(respone.data.role));
        localStorage.setItem('token', respone.data.token);
        localStorage.setItem('user', JSON.stringify(respone.data.userDTO));

        return respone.data; // Trả về dữ liệu response
    } catch (error) {
        if (error.response) {
            // Xử lý lỗi HTTP (404, 500, v.v.)
            switch (error.response.status) {
                case 404:
                case 500:
                case 400:
                    return error.response.status;
                default:
                    return "unknown_error"; // Trường hợp lỗi khác
            }
        } else {
            // Xử lý lỗi không phải HTTP
            console.error("Lỗi không xác định:", error);
            return "network_error";
        }
    }
};





 const logout = async () => {
    console.log("Đã đi vào logout");

    const token = localStorage.getItem('token');
    try {
        // Gửi yêu cầu API để logout
        await axios.post('http://localhost:8081/api/logout', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Hiển thị thông báo thành công
        toast.success("Đăng xuất thành công!");
    } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
        toast.error("Có lỗi xảy ra khi đăng xuất!");
    }

    // Xóa token và các thông tin liên quan khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('user');

    // Chuyển hướng về trang đăng nhập
    window.location.href = '/login';
};

const SaveUser = async (users) => {
    console.log("Đã đi vào phần SaveUser");

    try {
        users = {...users,
            address: "chưa có địa chỉ",
            roleId: 1,
            salary : 0,
            isActive: true
        }
        delete users.confirmPassword
        console.log(users);

        const respone = await axios.post(`http://localhost:8081/api/saveUser`,users)
        return respone.data;
    }catch (errors) {
        console.log(errors);
    }
}

/**
 * đây là lấy thông tin của user
 * lấy token và đem xuống rồi lấy thôn tin user ra
 * @returns {<status>} nếu quá trình xảy ra lỗi
 *                          - 404 và error.response.data = errorOldPassword (true) thì nó sẽ là lỗi mật khẩu cũ không đúng
 *                          - 404 thì đây chính là lỗi  mật khẩu cũ và mật khẩu mới trùng nhau
 *                          - trả về data là 200 nếu thành công
 */
const GetUser =async () => {
    console.log("đã đi vào phần GetUser");

    const token = localStorage.getItem('token');

    try {
        const respone = await axios.get(`http://localhost:8081/api/getUser`, {
            headers: {
                Authorization: `Bearer ${token}`, // Thêm token vào header
            },
        });

        return respone.data;
    } catch (error) {
        if (error.response.status === 400 || error.response.status === 500 || error.response.status === 401) {
            // localStorage.removeItem('token'); // Xóa token
            // toast.error("bạn đã bị lỗi rồi, bạn nên đăng nhập lại")
            // window.location.href = '/login'; // trở về với login
            console.log("Nó đang bị lỗi gì đó với token");
            console.log(error);


        }
    }
}
/**
 * Cập nhật thông tin người dùng
 * @param {Object} userDTO - Thông tin người dùng cần cập nhật
 * @returns {Object} - Dữ liệu người dùng sau khi cập nhật
 */

const updateUser1 = async (userDTO) => {
    if (!userDTO.id) {
        console.error("ID is missing in userDTO:", userDTO);
        return null;  // Kiểm tra nếu ID không tồn tại
    }

    // Lấy token từ localStorage (hoặc cookie nếu bạn sử dụng cookie để lưu trữ)
    const token = localStorage.getItem("token");  // Hoặc từ sessionStorage hoặc cookie

    if (!token) {
        console.error("Token is missing.");
        return null;  // Nếu không có token, không thực hiện yêu cầu
    }

    try {
        const response = await axios.put(
            `http://localhost:8081/api/users/${userDTO.id}`,
            userDTO,
            {
                headers: {
                    Authorization: `Bearer ${token}`  // Gửi token trong header
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        return null;
    }
};

const updateImage = async (imgUrl) => {
    try {
        console.log("đã đi vào phần updateImage");
        console.log(imgUrl);

        const token = localStorage.getItem('token');
        console.log("đây là token: "+token);

        // const test = encodeURIComponent(imgUrl);
        // console.log("đây là imgUrl: " + test);

        const response = await axios.get(`http://localhost:8081/api/upload-image-user`, {
            params: {
                imgUrl: imgUrl
            },
            headers: {
                Authorization: `Bearer ${token}`, // Thêm token vào header
            },
        });

        return response.data;
    } catch (error) {

    }
}


/**
 * @returns {<void>}
 *   - Cái này dùng để thêm token vào trong header cho nó tự động lấy ra kiểm tra
 *      nếu không có token tự động nó sẽ quay trở lại trang login (cái này là còn phần sau)
 *
 * @example
 * const response = await verifyCode(userInputCode, userEmail);
 * // Kiểm tra mã trạng thái trả về để xử lý thông báo cho người dùng.
 */
const fetchData = async () => {
    console.log("Đã đi vào trong này fetchData");

    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:8081/api/protected-resource', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("Dữ liệu:", response.data);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
};


const findUserByEmail =async (email) => {
    try {
        const response = await axios.get(`http://localhost:8081/api/find-user-by-email?email=${email}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log("Status Code:", error.response.status); // Log the status code
            console.log("Response Data:", error.response.data); // Log the error message
            return { status: error.response.status, data: error.response.data };
        } else {
            console.log("Error:", error.message); // Log if there's a different type of error
            return { status: 500, data: "An error occurred" };
        }
    }
}


const CreateNewPassword =async (newPassword,username,email) => {
    try {
        const response = await axios.get(`http://localhost:8081/api/find-user-by-email?email=${email}&username=${username}&newPassword=${newPassword}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log("Status Code:", error.response.status); // Log the status code
            console.log("Response Data:", error.response.data); // Log the error message
            return { status: error.response.status, data: error.response.data };
        } else {
            console.log("Error:", error.message); // Log if there's a different type of error
            return { status: 500, data: "An error occurred" };
        }
    }
}

const getAllUser = async () => {
    const token = localStorage.getItem('token');
    try {
        let users = await axios.get("http://localhost:8081/api/users", {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        console.log(users)
        return users
    } catch (e) {
        return []
    }
}

export {logout,getAllUser,SendCodeEmail,CreateAccount,CreateNewPassword,GetCode,Login,GetUser,SaveUser,fetchData,changePassword,updateImage,findUserByEmail,updateUser1};

