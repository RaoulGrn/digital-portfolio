import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, MapPin, Mail, Globe } from "lucide-react";

const UserInfo = ({ userInfo }) => (
  <div className="bg-gray-800 rounded-2xl p-12 shadow-lg mb-12">
    <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
      {userInfo.profilePicture && (
        <img
          src={userInfo.profilePicture}
          alt={userInfo.username}
          className="w-32 h-32 rounded-full object-cover border-4 border-teal-500"
        />
      )}
      <div className="text-center md:text-left flex-grow">
        <h1 className="text-4xl font-bold mb-2 text-teal-300">
          {userInfo.username}
        </h1>
        {userInfo.biography && (
          <p className="text-gray-300 mb-4">{userInfo.biography}</p>
        )}
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          {userInfo.domain && (
            <div className="flex items-center">
              <Briefcase className="mr-2 text-teal-300" />
              <div className="hover:bg-gradient-signup border-black p-1 hover:border-black hover:rounded-xl hover:py-1">
                <Link to={userInfo.domain}>{userInfo.domain}</Link>
              </div>
            </div>
          )}
          {(userInfo.city || userInfo.country) && (
            <div className="flex items-center">
              <MapPin className="mr-2 text-teal-300" />
              <span>
                {[userInfo.city, userInfo.country].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
          {userInfo.email && (
            <div className="flex items-center">
              <Mail className="mr-2 text-teal-300" />
              <a
                href={`https://mail.google.com/mail/u/0/#inbox?compose=new`}
                className="text-gray-300 hover:text-teal-300 transition-colors"
              >
                {userInfo.email}
              </a>
            </div>
          )}
          {userInfo.clientUrl && (
            <div className="flex items-center">
              <Globe className="mr-2 text-teal-300" />
              <a
                href={userInfo.clientUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-teal-300 transition-colors"
              >
                Website
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default UserInfo;
