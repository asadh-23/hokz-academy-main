import React from 'react';
import Header from '../../components/common/PublicHeader';
import Footer from '../../components/common/PublicFooter';

import CategoryList from '../../components/course/CategoryList';
import CourseList from '../../components/course/CourseList';


export default function UserDashboard() {
  return (
    <div>
      <Header />
      <main className="dashboard-content">
        <h2 className="text-2xl font-bold p-4">Explore More Courses</h2>
        <CourseList />
        <CategoryList />
      </main>
      <Footer />
    </div>
  );
}