import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  MapPin,
  Star,
  Play,
  ArrowRight,
  Zap
} from 'lucide-react';

// ------- Sports-focused clubs (GameCh brand) -------
const clubsData = [
  {
    id: 1,
    name: 'Taipei Runners Club',
    category: 'Running',
    members: 1860,
    image:
      'https://images.unsplash.com/photo-1542435503-956c469947f6?w=1200&h=600&fit=crop',
    description:
      'Group runs, track workouts, and weekend long runs for every pace.',
    rating: 4.8,
    nextEvent: 'Sunrise 10K (Aug 24)',
    location: 'Daan Forest Park'
  },
  {
    id: 2,
    name: 'City Strength Collective',
    category: 'Fitness',
    members: 1240,
    image:
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=600&fit=crop',
    description:
      'Functional training, strength cycles, and friendly PR nights.',
    rating: 4.9,
    nextEvent: 'Community Lift-Off',
    location: 'Xinyi Strength Lab'
  },
  {
    id: 3,
    name: 'Island Cyclists',
    category: 'Cycling',
    members: 990,
    image:
      'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=1200&h=600&fit=crop',
    description:
      'City night rides and weekend climbs—newbie to KOM chasers.',
    rating: 4.7,
    nextEvent: 'North Coast Loop',
    location: 'Riverside Park'
  },
  {
    id: 4,
    name: 'Open Court Tennis',
    category: 'Tennis',
    members: 720,
    image:
      'https://images.unsplash.com/photo-1546632565-0b6cc5721f6a?w=1200&h=600&fit=crop',
    description:
      'Match ladder, coaching clinics, and weekend mixers.',
    rating: 4.6,
    nextEvent: 'Doubles Social',
    location: 'Songshan Sports Center'
  },
  {
    id: 5,
    name: 'GreenFairways Golf Society',
    category: 'Golf',
    members: 530,
    image:
      'https://images.unsplash.com/photo-1466714310824-539f4e61035f?w=1200&h=600&fit=crop',
    description:
      'Nine-and-dines, short-game clinics, and friendly skins.',
    rating: 4.9,
    nextEvent: 'Par-3 Challenge',
    location: 'Miramar Golf Range'
  }
];

const stories = [
  {
    title: 'Global & Inclusive',
    description:
      'From a single meetup to a multi-sport network connecting athletes worldwide.',
    stats: 'Since 2020'
  },
  {
    title: 'Match What Matters',
    description:
      'Find partners by pace, level, and interests—make real connections, not just followers.',
    stats: '50K+ Members'
  },
  {
    title: 'Events That Stick',
    description: 'Weekly socials, skills clinics, and city challenges keep you moving.',
    stats: '2K+ Events'
  },
  {
    title: 'Move Together',
    description:
      'Make active lifestyles social and fun—no matter where you start.',
    stats: 'Our Mission'
  }
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % clubsData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % clubsData.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + clubsData.length) % clubsData.length);
  const goToSlide = (i) => setCurrentSlide(i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?w=1600&h=900&fit=crop)",
              opacity: 0.12,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Sports Community</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Connect with runners, lifters, cyclists, golfers and more. Match by level, meet nearby, and move together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg"
                onClick={() => window.location.href = '/sign-up'}
              >
                <Play className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => document.getElementById('clubs')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Users className="mr-2 h-5 w-5" />
                Browse Clubs <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { title: 'Match by Level', desc: 'Beginner to advanced, find partners who fit your pace.' },
              { title: 'IRL + Online', desc: 'Join local meetups or hop into virtual sessions.' },
              { title: 'Safe & Welcoming', desc: 'Verified hosts and community guidelines that protect everyone.' }
            ].map((item, i) => (
              <Card key={i} className="bg-slate-900/60 border-white/10">
                <CardContent className="p-6 text-center">
                  <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-white/70">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clubs Slider Section */}
      <section id="clubs" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Featured <span className="text-purple-300">Clubs</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover active communities and find your perfect fit
            </p>
          </div>

          {/* Slider Container */}
          <div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {clubsData.map((club) => (
                <div key={club.id} className="w-full flex-shrink-0">
                  <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-white/10 overflow-hidden">
                    <div className="relative h-96 md:h-[500px]">
                      <img
                        src={club.image}
                        alt={`${club.name} cover`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Club Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <Badge className="bg-purple-600/80 text-white mb-3">{club.category}</Badge>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{club.name}</h3>
                            <p className="text-lg text-white/80 mb-4 max-w-md">{club.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-yellow-400 mb-2">
                              <Star className="h-5 w-5 fill-current mr-1" />
                              <span className="text-white font-semibold">{club.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="flex items-center text-white/80">
                            <Users className="h-5 w-5 mr-2 text-purple-300" />
                            <span>{club.members.toLocaleString()} members</span>
                          </div>
                          <div className="flex items-center text-white/80">
                            <Calendar className="h-5 w-5 mr-2 text-purple-300" />
                            <span>{club.nextEvent}</span>
                          </div>
                          <div className="flex items-center text-white/80">
                            <MapPin className="h-5 w-5 mr-2 text-purple-300" />
                            <span>{club.location}</span>
                          </div>
                        </div>

                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                          Join Club <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <Button
              aria-label="Previous slide"
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              aria-label="Next slide"
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {clubsData.map((_, index) => (
                <button
                  key={index}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-purple-300' : 'bg-white/30'
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story / Why Section */}
      <section id="community" className="py-20 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The <span className="text-purple-300">Gamech</span> Story
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              From a single meetup to a worldwide movement of people who love to move—together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stories.map((story, i) => (
              <Card
                key={i}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10 hover:border-purple-300/30 transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600/30 transition-colors">
                    <Zap className="h-8 w-8 text-purple-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{story.title}</h3>
                  <p className="text-white/70 mb-4 leading-relaxed">{story.description}</p>
                  <div className="text-purple-300 font-semibold text-lg">{story.stats}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="events" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl p-12 shadow-2xl">
            <Zap className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Move Together?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join activities near you or start your own event. Find training partners, make friends, and build a habit that sticks.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-black/20 backdrop-blur-sm text-white border-2 border-white/30 hover:border-white/60 hover:bg-black/30 px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20"
                onClick={() => window.location.href = '/sign-up'}
              >
                <Users className="mr-3 h-5 w-5" />
                Join the Community
              </Button>
              <Button 
                size="lg"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/20 px-10 py-4 text-lg font-semibold rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/20"
                onClick={() => window.location.href = 'mailto:google@gmail.com'}
              >
                <Calendar className="mr-3 h-5 w-5" />
                Host an Event
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400" />
              <span className="text-2xl font-bold text-white">GameCh</span>
            </div>
            <p className="text-white/60 mb-6">The sports social platform for active lives</p>
            <div className="text-white/40 text-sm">© 2025 GameCh. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
