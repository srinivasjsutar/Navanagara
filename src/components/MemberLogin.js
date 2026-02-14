// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { LoginHeader } from "./LoginHeader";

// const schema = Yup.object({
//   username: Yup.string().trim().required("Username is required"),
//   password: Yup.string().required("Password is required"),
// });

// export function MemberLogin() {
//   const formik = useFormik({
//     initialValues: { username: "", password: "" },
//     validationSchema: schema,
//     onSubmit: (values) => {
//       // TODO: call API here
//       console.log("Login submit:", values);
//     },
//   });

//   const fieldBase =
//     "w-full rounded-xl bg-[#F0EDFFCC] px-14 py-3 text-md outline-none ring-1 ring-transparent " +
//     "focus:bg-white focus:ring-indigo-200 transition placeholder:text-[#1C1C1C]";

//   return (
//     <div>
//       <LoginHeader />
//       <div className="min-h-screen w-full bg-white flex items-center justify-center font-poppins p-4">
//         {/* Outer container */}
//         <div className="w-full max-w-6xl rounded-3xl bg-white overflow-hidden">
//           <div className="flex gap-[120px]">
//             {/* LEFT CARD */}
//             <img
//               className="lg:w-[450px] lg:h-[480px]"
//               src="/images/admin_login_img.webp"
//             />

//             {/* RIGHT FORM */}
//             <div className="p-8 md:p-12 flex items-center">
//               <div className="w-full max-w-md mx-auto">
//                 <h1 className="lg:text-[60px] font-bold tracking-tight text-gray-900">
//                   MEMBER LOGIN
//                 </h1>
//                 <p className="mt-4 text-[20px] text-[#525252]">
//                   How to i get started lorem ipsum dolor at?
//                 </p>

//                 <form
//                   onSubmit={formik.handleSubmit}
//                   className="mt-14 space-y-4"
//                 >
//                   {/* Username */}
//                   <div>
//                     <div className="relative">
//                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
//                         <img src="/images/person.svg" />
//                       </span>

//                       <input
//                         type="text"
//                         name="username"
//                         placeholder="Username"
//                         className={fieldBase}
//                         value={formik.values.username}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                       />
//                     </div>
//                     {formik.touched.username && formik.errors.username ? (
//                       <p className="mt-1 text-xs text-red-600">
//                         {formik.errors.username}
//                       </p>
//                     ) : null}
//                   </div>

//                   {/* Password */}
//                   <div>
//                     <div className="relative">
//                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
//                         <img src="/images/password.svg" />
//                       </span>

//                       <input
//                         type="password"
//                         name="password"
//                         placeholder="Password"
//                         className={fieldBase}
//                         value={formik.values.password}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                       />
//                     </div>
//                     {formik.touched.password && formik.errors.password ? (
//                       <p className="mt-1 text-xs text-red-600">
//                         {formik.errors.password}
//                       </p>
//                     ) : null}
//                   </div>

//                   {/* Button */}
//                   <div className="pt-2">
//                     <button
//                       type="submit"
//                       className="w-44 mx-auto block rounded-2xl py-3 text-[16px] font-semibold text-white
//                       bg-gradient-to-r from-[#FFFF00] via-[#7158B6] to-[#7158B6]
//                       hover:brightness-105 active:scale-[0.99] transition"
//                     >
//                       Login Now
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
