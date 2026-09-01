import { Link } from "react-router-dom";
import appStoreImg from "@/assets/images/footer/app-store.png";
import androidImg from "@/assets/images/footer/android.png";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0B1220] pt-12 sm:pt-14 pb-8 border-t border-transparent transition-colors duration-200">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        
        {/* ── Main Footer Grid (6 Columns on Desktop) ── */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          
          {/* Column 1: JobBox Info */}
          <div className="lg:col-span-1 flex flex-col">
            <Link
              to="/"
              className="inline-flex items-center transition-opacity hover:opacity-90 w-fit"
              aria-label="JobBox Home"
            >
              <svg
                className="h-[32px] w-auto"
                viewBox="0 0 139 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 10.3508L14.5 2V19.6126L0 27.2042V10.3508Z" fill="#91A9FF" />
                <path d="M28.9241 10.3508L14.4241 2V19.6126L28.9241 27.2042V10.3508Z" fill="#5E81FF" />
                <path d="M14.4241 19.6126L28.9241 27.2042L14.4241 34.7958L-7.23942e-06 27.2042L14.4241 19.6126Z" fill="#3C65F5" />
                <path
                  className="fill-[#05264E] dark:fill-[#F1F5F9]"
                  d="M35.9424 30V26.0018H37.2276C38.0843 26.0018 38.7698 25.7638 39.2838 25.2878C39.8169 24.7928 40.0835 24.1455 40.0835 23.3458V8.72374H44.5101V23.1459C44.5101 24.5167 44.215 25.7162 43.6247 26.7443C43.0345 27.7724 42.1873 28.5721 41.083 29.1432C39.9978 29.7144 38.7126 30 37.2276 30H35.9424ZM55.6332 30.3427C54.0911 30.3427 52.6822 29.9905 51.4065 29.286C50.15 28.5816 49.1409 27.6201 48.3793 26.4016C47.6368 25.1641 47.2655 23.7647 47.2655 22.2035C47.2655 20.6232 47.6368 19.2238 48.3793 18.0053C49.1409 16.7868 50.15 15.8253 51.4065 15.1209C52.6822 14.4164 54.0911 14.0642 55.6332 14.0642C57.1754 14.0642 58.5748 14.4164 59.8314 15.1209C61.088 15.8253 62.0875 16.7868 62.83 18.0053C63.5916 19.2238 63.9724 20.6232 63.9724 22.2035C63.9724 23.7647 63.5916 25.1641 62.83 26.4016C62.0875 27.6201 61.088 28.5816 59.8314 29.286C58.5748 29.9905 57.1754 30.3427 55.6332 30.3427ZM55.6332 26.4873C56.4138 26.4873 57.0897 26.3064 57.6609 25.9447C58.2511 25.5829 58.7081 25.0784 59.0317 24.431C59.3744 23.7837 59.5458 23.0412 59.5458 22.2035C59.5458 21.3657 59.3744 20.6327 59.0317 20.0044C58.7081 19.3571 58.2511 18.8526 57.6609 18.4908C57.0897 18.11 56.4138 17.9197 55.6332 17.9197C54.8526 17.9197 54.1672 18.11 53.577 18.4908C52.9868 18.8526 52.5203 19.3571 52.1776 20.0044C51.854 20.6327 51.6921 21.3657 51.6921 22.2035C51.6921 23.0412 51.854 23.7837 52.1776 24.431C52.5203 25.0784 52.9868 25.5829 53.577 25.9447C54.1672 26.3064 54.8526 26.4873 55.6332 26.4873ZM75.235 30.3427C74.1688 30.3427 73.1788 30.1523 72.2649 29.7715C71.3701 29.3717 70.6466 28.791 70.0944 28.0294L70.4943 27.1441V30H66.496V8.38104H70.7799V17.377L70.123 16.5203C70.6371 15.7397 71.332 15.1399 72.2078 14.7211C73.1026 14.2832 74.1212 14.0642 75.2636 14.0642C76.7486 14.0642 78.0909 14.426 79.2904 15.1495C80.4898 15.8729 81.4418 16.8535 82.1462 18.091C82.8507 19.3095 83.2029 20.6803 83.2029 22.2035C83.2029 23.7076 82.8507 25.0784 82.1462 26.3159C81.4608 27.5535 80.5184 28.534 79.3189 29.2575C78.1195 29.981 76.7582 30.3427 75.235 30.3427ZM74.721 26.4873C75.5206 26.4873 76.2251 26.3064 76.8343 25.9447C77.4436 25.5829 77.9195 25.0784 78.2622 24.431C78.605 23.7837 78.7763 23.0412 78.7763 22.2035C78.7763 21.3657 78.605 20.6327 78.2622 20.0044C77.9195 19.3571 77.4436 18.8526 76.8343 18.4908C76.2251 18.11 75.5206 17.9197 74.721 17.9197C73.9594 17.9197 73.274 18.1005 72.6647 18.4623C72.0745 18.824 71.6081 19.3286 71.2654 19.9759C70.9417 20.6232 70.7799 21.3657 70.7799 22.2035C70.7799 23.0412 70.9417 23.7837 71.2654 24.431C71.6081 25.0784 72.0745 25.5829 72.6647 25.9447C73.274 26.3064 73.9594 26.4873 74.721 26.4873ZM86.026 30V8.72374H95.022C96.488 8.72374 97.7446 8.97125 98.7917 9.46627C99.8389 9.96129 100.639 10.6753 101.191 11.6082C101.743 12.5221 102.019 13.6358 102.019 14.9495C102.019 15.8825 101.762 16.7773 101.248 17.6341C100.734 18.4718 99.8865 19.1762 98.7061 19.7474V17.5769C99.8294 18.0149 100.696 18.5384 101.305 19.1477C101.914 19.7569 102.333 20.4233 102.561 21.1468C102.79 21.8512 102.904 22.5938 102.904 23.3744C102.904 25.4687 102.209 27.0965 100.819 28.2579C99.4295 29.4193 97.4971 30 95.022 30H86.026ZM90.4526 26.1446H95.536C96.4309 26.1446 97.1449 25.8875 97.6779 25.3735C98.211 24.8594 98.4776 24.1931 98.4776 23.3744C98.4776 22.5367 98.211 21.8608 97.6779 21.3467C97.1449 20.8326 96.4309 20.5756 95.536 20.5756H90.4526V26.1446ZM90.4526 16.7202H95.3361C96.0215 16.7202 96.5642 16.5298 96.964 16.149C97.3828 15.7492 97.5923 15.2256 97.5923 14.5783C97.5923 13.931 97.3828 13.4169 96.964 13.0361C96.5642 12.6363 96.0215 12.4364 95.3361 12.4364H90.4526V16.7202ZM113.169 30.3427C111.627 30.3427 110.218 29.9905 108.942 29.286C107.686 28.5816 106.677 27.6201 105.915 26.4016C105.173 25.1641 104.801 23.7647 104.801 22.2035C104.801 20.6232 105.173 19.2238 105.915 18.0053C106.677 16.7868 107.686 15.8253 108.942 15.1209C110.218 14.4164 111.627 14.0642 113.169 14.0642C114.711 14.0642 116.111 14.4164 117.367 15.1209C118.624 15.8253 119.623 16.7868 120.366 18.0053C121.127 19.2238 121.508 20.6232 121.508 22.2035C121.508 23.7647 121.127 25.1641 120.366 26.4016C119.623 27.6201 118.624 28.5816 117.367 29.286C116.111 29.9905 114.711 30.3427 113.169 30.3427ZM113.169 26.4873C113.95 26.4873 114.626 26.3064 115.197 25.9447C115.787 25.5829 116.244 25.0784 116.568 24.431C116.91 23.7837 117.082 23.0412 117.082 22.2035C117.082 21.3657 116.91 20.6327 116.568 20.0044C116.244 19.3571 115.787 18.8526 115.197 18.4908C114.626 18.11 113.95 17.9197 113.169 17.9197C112.388 17.9197 111.703 18.11 111.113 18.4908C110.523 18.8526 110.056 19.3571 109.713 20.0044C109.39 20.6327 109.228 21.3657 109.228 22.2035C109.228 23.0412 109.39 23.7837 109.713 24.431C110.056 25.0784 110.523 25.5829 111.113 25.9447C111.703 26.3064 112.388 26.4873 113.169 26.4873ZM122.246 30L127.701 22.1749L122.217 14.4069H127.187L131.299 20.4614H129.129L133.241 14.4069H138.21L132.727 22.1749L138.153 30H133.213L129.186 23.9455H131.242L127.215 30H122.246Z"
                />
              </svg>
            </Link>

            <p className="mt-4 text-[13px] leading-[1.65] text-[#4F5E64] dark:text-slate-400 max-w-[260px]">
              JobBox is the heart of the design community and the best resource to discover and connect with designers and jobs worldwide.
            </p>

            {/* Social Icons — UI Only (Facebook, Twitter, LinkedIn) */}
            <div className="mt-5 flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3C65F5] text-white hover:bg-[#05264E] transition-colors cursor-pointer"
                aria-label="Facebook"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </span>

              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3C65F5] text-white hover:bg-[#05264E] transition-colors cursor-pointer"
                aria-label="Twitter"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                </svg>
              </span>

              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3C65F5] text-white hover:bg-[#05264E] transition-colors cursor-pointer"
                aria-label="LinkedIn"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="text-[16px] font-bold text-[#05264E] dark:text-[#F1F5F9] mb-4">
              Resources
            </h3>
            <ul className="flex flex-col gap-2.5">
              {["About us", "Our Team", "Products", "Contact"].map((link) => (
                <li key={link}>
                  <span className="text-[13px] text-[#4F5E64] dark:text-slate-400 hover:text-[#3C65F5] dark:hover:text-[#5E81FF] transition-colors cursor-pointer">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Community */}
          <div>
            <h3 className="text-[16px] font-bold text-[#05264E] dark:text-[#F1F5F9] mb-4">
              Community
            </h3>
            <ul className="flex flex-col gap-2.5">
              {["Feature", "Pricing", "Credit", "FAQ"].map((link) => (
                <li key={link}>
                  <span className="text-[13px] text-[#4F5E64] dark:text-slate-400 hover:text-[#3C65F5] dark:hover:text-[#5E81FF] transition-colors cursor-pointer">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick links */}
          <div>
            <h3 className="text-[16px] font-bold text-[#05264E] dark:text-[#F1F5F9] mb-4">
              Quick links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {["iOS", "Android", "Microsoft", "Desktop"].map((link) => (
                <li key={link}>
                  <span className="text-[13px] text-[#4F5E64] dark:text-slate-400 hover:text-[#3C65F5] dark:hover:text-[#5E81FF] transition-colors cursor-pointer">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: More */}
          <div>
            <h3 className="text-[16px] font-bold text-[#05264E] dark:text-[#F1F5F9] mb-4">
              More
            </h3>
            <ul className="flex flex-col gap-2.5">
              {["Privacy", "Help", "Terms", "FAQ"].map((link) => (
                <li key={link}>
                  <span className="text-[13px] text-[#4F5E64] dark:text-slate-400 hover:text-[#3C65F5] dark:hover:text-[#5E81FF] transition-colors cursor-pointer">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 6: Download App */}
          <div>
            <h3 className="text-[16px] font-bold text-[#05264E] dark:text-[#F1F5F9] mb-4">
              Download App
            </h3>
            <p className="text-[13px] leading-[1.6] text-[#4F5E64] dark:text-slate-400 mb-4 max-w-[200px]">
              Download our Apps and get extra 15% Discount on your first Order...!
            </p>
            <div className="flex flex-col gap-2.5">
              <span className="inline-block w-fit cursor-pointer transition-opacity hover:opacity-90">
                <img
                  src={appStoreImg}
                  alt="Download on the App Store"
                  className="h-[34px] w-auto object-contain rounded-md"
                />
              </span>
              <span className="inline-block w-fit cursor-pointer transition-opacity hover:opacity-90">
                <img
                  src={androidImg}
                  alt="GET IT ON Google Play"
                  className="h-[34px] w-auto object-contain rounded-md"
                />
              </span>
            </div>
          </div>

        </div>

        {/* ── Divider ── */}
        <div className="mt-12 mb-6 border-t border-[#E0E6F7] dark:border-slate-800" />

        {/* ── Bottom Footer Row ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#66789C] dark:text-slate-400">
          <p>
            Copyright &copy; 2022. JobBox all right reserved
          </p>

          <div className="flex items-center gap-6 sm:gap-8">
            <span className="hover:text-[#3C65F5] dark:hover:text-[#5E81FF] transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-[#3C65F5] dark:hover:text-[#5E81FF] transition-colors cursor-pointer">
              Terms &amp; Conditions
            </span>
            <span className="hover:text-[#3C65F5] dark:hover:text-[#5E81FF] transition-colors cursor-pointer">
              Security
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
